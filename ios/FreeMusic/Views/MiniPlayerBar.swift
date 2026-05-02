import SwiftUI

struct MiniPlayerBar: View {
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites
    @State private var showFullPlayer = false

    var body: some View {
        Button { showFullPlayer = true } label: {
            HStack(spacing: 12) {
                artworkView
                    .frame(width: 44, height: 44)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .strokeBorder(.white.opacity(0.06), lineWidth: 1)
                    )

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
                        .tint(Color.accentColor)
                } else {
                    Button { player.togglePlayPause() } label: {
                        Image(systemName: player.isPlaying ? "pause.fill" : "play.fill")
                            .font(.title3)
                            .frame(width: 36, height: 36)
                            .background(.white.opacity(0.06))
                            .clipShape(Circle())
                    }
                }

                if player.isTrackMode {
                    Button { player.next() } label: {
                        Image(systemName: "forward.fill")
                            .font(.subheadline)
                            .frame(width: 36, height: 36)
                            .background(.white.opacity(0.06))
                            .clipShape(Circle())
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.brandSurface.opacity(0.9))
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .strokeBorder(.white.opacity(0.06), lineWidth: 1)
            )
            .padding(.horizontal, 8)
            .shadow(color: Color.accentColor.opacity(0.08), radius: 20, y: 0)
            .shadow(color: .black.opacity(0.4), radius: 12, y: 4)
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
                artworkPlaceholder
            }
        } else {
            artworkPlaceholder
        }
    }

    private var artworkPlaceholder: some View {
        RoundedRectangle(cornerRadius: 8)
            .fill(Color.accentColor.opacity(0.15))
            .overlay {
                Image(systemName: player.isRadioMode ? "radio.fill" : "music.note")
                    .font(.caption)
                    .foregroundStyle(Color.accentColor.opacity(0.6))
            }
    }
}
