import SwiftUI

struct MiniPlayerBar: View {
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites
    @State private var showFullPlayer = false

    var body: some View {
        Button { showFullPlayer = true } label: {
            HStack(spacing: 12) {
                artworkView
                    .frame(width: 40, height: 40)
                    .clipShape(RoundedRectangle(cornerRadius: 6))

                VStack(alignment: .leading, spacing: 2) {
                    Text(player.nowPlayingTitle)
                        .font(.subheadline.weight(.semibold))
                        .lineLimit(1)
                    Text(player.nowPlayingSubtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Spacer()

                if player.isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    Button { player.togglePlayPause() } label: {
                        Image(systemName: player.isPlaying ? "pause.fill" : "play.fill")
                            .font(.title3)
                    }
                }

                if player.isTrackMode {
                    Button { player.next() } label: {
                        Image(systemName: "forward.fill")
                            .font(.subheadline)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal, 8)
            .shadow(color: .black.opacity(0.3), radius: 8, y: 4)
        }
        .buttonStyle(.plain)
        .sheet(isPresented: $showFullPlayer) {
            FullPlayerView()
        }
    }

    @ViewBuilder
    private var artworkView: some View {
        let url = player.currentTrack?.artworkUrl ?? player.currentStation?.favicon
        if let url, let imageUrl = URL(string: url) {
            AsyncImage(url: imageUrl) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                musicPlaceholder
            }
        } else {
            musicPlaceholder
        }
    }

    private var musicPlaceholder: some View {
        RoundedRectangle(cornerRadius: 6)
            .fill(Color.accentColor.opacity(0.3))
            .overlay {
                Image(systemName: player.isRadioMode ? "radio.fill" : "music.note")
                    .foregroundStyle(Color.accentColor)
            }
    }
}
