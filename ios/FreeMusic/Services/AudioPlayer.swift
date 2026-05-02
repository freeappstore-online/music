import AVFoundation
import MediaPlayer
import Foundation
import UIKit

@MainActor @Observable
final class AudioPlayer {
    var currentTrack: Track?
    var currentStation: RadioStation?
    var isPlaying = false
    var isLoading = false
    var progress: Double = 0 // 0-1
    var currentTime: Double = 0
    var duration: Double = 0

    var queue: [Track] = []
    var queueIndex: Int = 0

    private var player: AVPlayer?
    private var timeObserver: Any?

    var isTrackMode: Bool { currentTrack != nil }
    var isRadioMode: Bool { currentStation != nil }

    var nowPlayingTitle: String {
        currentTrack?.title ?? currentStation?.name ?? ""
    }

    var nowPlayingSubtitle: String {
        currentTrack?.artist ?? currentStation?.displayGenre ?? ""
    }

    func playTrack(_ track: Track, queue: [Track]? = nil, index: Int = 0) {
        if let queue { self.queue = queue; self.queueIndex = index }
        currentStation = nil
        currentTrack = track
        startPlayback(url: track.streamUrl)
    }

    func playStation(_ station: RadioStation) {
        currentTrack = nil
        queue = []
        currentStation = station
        startPlayback(url: station.streamUrl)
    }

    func togglePlayPause() {
        guard let player else { return }
        if isPlaying {
            player.pause()
            isPlaying = false
        } else {
            player.play()
            isPlaying = true
        }
        updateNowPlaying()
    }

    func next() {
        guard !queue.isEmpty else { return }
        queueIndex = (queueIndex + 1) % queue.count
        let track = queue[queueIndex]
        currentTrack = track
        startPlayback(url: track.streamUrl)
    }

    func previous() {
        guard !queue.isEmpty else { return }
        // If more than 3 seconds in, restart; otherwise go to previous
        if currentTime > 3 {
            player?.seek(to: .zero)
            return
        }
        queueIndex = (queueIndex - 1 + queue.count) % queue.count
        let track = queue[queueIndex]
        currentTrack = track
        startPlayback(url: track.streamUrl)
    }

    func seek(to fraction: Double) {
        guard let player, duration > 0 else { return }
        let time = CMTime(seconds: fraction * duration, preferredTimescale: 600)
        player.seek(to: time)
    }

    func stop() {
        cleanup()
        currentTrack = nil
        currentStation = nil
        isPlaying = false
        progress = 0
        currentTime = 0
        duration = 0
    }

    private func startPlayback(url: String) {
        cleanup()
        guard let streamUrl = URL(string: url) else {
            Log.error("Invalid URL: \(url)")
            return
        }

        isLoading = true
        configureAudioSession()

        let item = AVPlayerItem(url: streamUrl)
        player = AVPlayer(playerItem: item)
        player?.play()
        isPlaying = true

        // Observe when ready to play
        Task {
            while item.status == .unknown {
                try? await Task.sleep(for: .milliseconds(100))
            }
            isLoading = false
            if item.status == .failed {
                Log.error("Playback failed: \(item.error?.localizedDescription ?? "unknown")")
                isPlaying = false
                return
            }
            let dur = try? await item.asset.load(.duration)
            if let dur, dur.seconds.isFinite {
                duration = dur.seconds
            }
        }

        // Time observer
        timeObserver = player?.addPeriodicTimeObserver(forInterval: CMTime(seconds: 0.5, preferredTimescale: 600), queue: .main) { [weak self] time in
            Task { @MainActor in
                guard let self else { return }
                self.currentTime = time.seconds
                if self.duration > 0 {
                    self.progress = time.seconds / self.duration
                }
                self.updateNowPlaying()
            }
        }

        // Auto-advance on finish
        NotificationCenter.default.addObserver(forName: .AVPlayerItemDidPlayToEndTime, object: item, queue: .main) { [weak self] _ in
            Task { @MainActor in
                self?.next()
            }
        }

        setupRemoteCommands()
        updateNowPlaying()
    }

    private func configureAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default)
            try session.setActive(true)
        } catch {
            Log.error("Audio session error: \(error)")
        }
    }

    private func setupRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()
        center.playCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.togglePlayPause() }
            return .success
        }
        center.pauseCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.togglePlayPause() }
            return .success
        }
        center.nextTrackCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.next() }
            return .success
        }
        center.previousTrackCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.previous() }
            return .success
        }
    }

    private var cachedArtworkUrl: String?
    private var cachedArtwork: MPMediaItemArtwork?

    private func updateNowPlaying() {
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: nowPlayingTitle,
            MPMediaItemPropertyArtist: nowPlayingSubtitle,
            MPNowPlayingInfoPropertyPlaybackRate: isPlaying ? 1.0 : 0.0,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: currentTime,
        ]
        if duration > 0 {
            info[MPMediaItemPropertyPlaybackDuration] = duration
        }
        if let artwork = cachedArtwork {
            info[MPMediaItemPropertyArtwork] = artwork
        }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info

        // Fetch artwork if URL changed
        let artUrl = currentTrack?.artworkUrl ?? currentStation?.favicon
        if let artUrl, artUrl != cachedArtworkUrl {
            cachedArtworkUrl = artUrl
            Task {
                await fetchArtwork(from: artUrl)
            }
        }
    }

    private func fetchArtwork(from urlString: String) async {
        guard let url = URL(string: urlString) else { return }
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            guard let image = UIImage(data: data) else { return }
            let artwork = MPMediaItemArtwork(boundsSize: image.size) { _ in image }
            cachedArtwork = artwork
            // Update now playing info again with artwork
            var info = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
            info[MPMediaItemPropertyArtwork] = artwork
            MPNowPlayingInfoCenter.default().nowPlayingInfo = info
            Log.info("Lock screen artwork set for: \(urlString)")
        } catch {
            Log.error("Failed to fetch artwork: \(error)")
        }
    }

    private func cleanup() {
        if let timeObserver, let player {
            player.removeTimeObserver(timeObserver)
        }
        timeObserver = nil
        player?.pause()
        player = nil
        NotificationCenter.default.removeObserver(self)
    }
}
