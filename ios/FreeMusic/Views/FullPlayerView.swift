import SwiftUI

struct FullPlayerView: View {
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                Spacer()

                // Artwork
                artworkView
                    .frame(width: 280, height: 280)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .black.opacity(0.4), radius: 20, y: 10)

                // Title & artist
                VStack(spacing: 6) {
                    Text(player.nowPlayingTitle)
                        .font(.title2.weight(.bold))
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                    Text(player.nowPlayingSubtitle)
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)

                    if let track = player.currentTrack {
                        Text(sourceLabel(track.source))
                            .font(.caption2)
                            .foregroundStyle(.tertiary)
                            .padding(.top, 2)
                    }
                }
                .padding(.horizontal)

                // Progress bar (tracks only)
                if player.isTrackMode, player.duration > 0 {
                    VStack(spacing: 4) {
                        Slider(value: Binding(
                            get: { player.progress },
                            set: { player.seek(to: $0) }
                        ))
                        .tint(Color.accentColor)

                        HStack {
                            Text(formatTime(player.currentTime))
                            Spacer()
                            Text("-\(formatTime(player.duration - player.currentTime))")
                        }
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    }
                    .padding(.horizontal, 24)
                }

                // Controls
                HStack(spacing: 40) {
                    if player.isTrackMode {
                        Button { player.previous() } label: {
                            Image(systemName: "backward.fill")
                                .font(.title2)
                        }
                    }

                    Button { player.togglePlayPause() } label: {
                        Image(systemName: player.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 64))
                    }

                    if player.isTrackMode {
                        Button { player.next() } label: {
                            Image(systemName: "forward.fill")
                                .font(.title2)
                        }
                    }
                }

                // Favorite button
                if let track = player.currentTrack {
                    Button { favorites.toggleTrack(track) } label: {
                        Image(systemName: favorites.isTrackFavorite(track) ? "heart.fill" : "heart")
                            .font(.title3)
                            .foregroundStyle(favorites.isTrackFavorite(track) ? .red : .secondary)
                    }
                } else if let station = player.currentStation {
                    Button { favorites.toggleStation(station) } label: {
                        Image(systemName: favorites.isStationFavorite(station) ? "heart.fill" : "heart")
                            .font(.title3)
                            .foregroundStyle(favorites.isStationFavorite(station) ? .red : .secondary)
                    }
                }

                Spacer()
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "chevron.down")
                            .font(.title3)
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    @ViewBuilder
    private var artworkView: some View {
        let url = player.currentTrack?.artworkUrl ?? player.currentStation?.favicon
        if let url, let imageUrl = URL(string: url) {
            AsyncImage(url: imageUrl) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                artworkPlaceholder
            }
        } else {
            artworkPlaceholder
        }
    }

    private var artworkPlaceholder: some View {
        RoundedRectangle(cornerRadius: 16)
            .fill(
                LinearGradient(
                    colors: [Color.accentColor.opacity(0.6), Color.accentColor.opacity(0.2)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .overlay {
                Image(systemName: player.isRadioMode ? "radio.fill" : "music.note")
                    .font(.system(size: 64))
                    .foregroundStyle(.white.opacity(0.8))
            }
    }

    private func sourceLabel(_ source: MusicSource) -> String {
        switch source {
        case .jamendo: return "Jamendo"
        case .internetArchive: return "Internet Archive"
        case .ccmixter: return "ccMixter"
        case .radio: return "Radio"
        }
    }

    private func formatTime(_ seconds: Double) -> String {
        let m = Int(seconds) / 60
        let s = Int(seconds) % 60
        return String(format: "%d:%02d", m, s)
    }
}
