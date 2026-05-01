import SwiftUI

struct HomeTab: View {
    @Environment(AudioPlayer.self) private var player
    @State private var trending: [Track] = []
    @State private var isLoading = true

    private let genres = ["electronic", "rock", "jazz", "hiphop", "classical", "ambient", "pop", "metal"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Trending section
                    sectionHeader("Trending This Week")
                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                            .padding()
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            LazyHStack(spacing: 12) {
                                ForEach(trending) { track in
                                    TrackCard(track: track) {
                                        player.playTrack(track, queue: trending, index: trending.firstIndex(of: track) ?? 0)
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    // Genre grid
                    sectionHeader("Browse by Genre")
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(genres, id: \.self) { genre in
                            NavigationLink {
                                GenreView(genre: genre)
                            } label: {
                                GenreCard(genre: genre)
                            }
                        }
                    }
                    .padding(.horizontal)

                    // Sources info
                    VStack(alignment: .leading, spacing: 8) {
                        sectionHeader("Sources")
                        Text("All music is Creative Commons or public domain. Free forever, no ads.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal)
                        HStack(spacing: 16) {
                            sourceChip("Jamendo")
                            sourceChip("Internet Archive")
                            sourceChip("Radio Browser")
                        }
                        .padding(.horizontal)
                    }
                    .padding(.bottom, 80)
                }
                .padding(.top)
            }
            .navigationTitle("FreeMusic")
            .task { await loadTrending() }
        }
    }

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.title3.weight(.bold))
            .padding(.horizontal)
    }

    private func sourceChip(_ name: String) -> some View {
        Text(name)
            .font(.caption2.weight(.medium))
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color.accentColor.opacity(0.15))
            .foregroundStyle(Color.accentColor)
            .clipShape(Capsule())
    }

    private func loadTrending() async {
        isLoading = true
        trending = await JamendoService.trending(limit: 20)
        isLoading = false
    }
}

struct TrackCard: View {
    let track: Track
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 6) {
                AsyncImage(url: URL(string: track.artworkUrl ?? "")) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.accentColor.opacity(0.2))
                        .overlay {
                            Image(systemName: "music.note")
                                .foregroundStyle(Color.accentColor)
                        }
                }
                .frame(width: 140, height: 140)
                .clipShape(RoundedRectangle(cornerRadius: 8))

                Text(track.title)
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                Text(track.artist)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            .frame(width: 140)
        }
        .buttonStyle(.plain)
    }
}

struct GenreCard: View {
    let genre: String

    private let colors: [String: Color] = [
        "electronic": .blue,
        "rock": .red,
        "jazz": .orange,
        "hiphop": .purple,
        "classical": .brown,
        "ambient": .teal,
        "pop": .pink,
        "metal": .gray,
    ]

    var body: some View {
        Text(genre.capitalized)
            .font(.headline)
            .frame(maxWidth: .infinity)
            .frame(height: 60)
            .background(
                LinearGradient(
                    colors: [colors[genre, default: .accentColor].opacity(0.7), colors[genre, default: .accentColor].opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
