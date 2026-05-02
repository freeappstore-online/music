import SwiftUI

struct SearchTab: View {
    @Environment(AudioPlayer.self) private var player
    @State private var query = ""
    @State private var tracks: [Track] = []
    @State private var isSearching = false
    @State private var hasSearched = false

    var body: some View {
        NavigationStack {
            List {
                if isSearching {
                    ProgressView("Searching all sources...")
                        .frame(maxWidth: .infinity)
                        .listRowBackground(Color.clear)
                } else if hasSearched && tracks.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        Text("No results found")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                    .listRowBackground(Color.clear)
                } else if !hasSearched {
                    VStack(spacing: 8) {
                        Image(systemName: "music.note.list")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        Text("Search across Jamendo & Internet Archive")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                    .listRowBackground(Color.clear)
                } else {
                    ForEach(tracks) { track in
                        TrackRow(track: track) {
                            player.playTrack(track, queue: tracks, index: tracks.firstIndex(of: track) ?? 0)
                        }
                    }
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(Color.brandBg)
            .navigationTitle("Search")
            .searchable(text: $query, prompt: "Songs, artists, albums...")
            .onSubmit(of: .search) {
                Task { await search() }
            }
            .contentMargins(.bottom, 80)
        }
    }

    private func search() async {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        isSearching = true
        hasSearched = true

        async let jamendo = JamendoService.search(query, limit: 20)
        async let archive = InternetArchiveService.search(query, limit: 10)

        let j = await jamendo
        let ia = await archive
        tracks = j + ia
        isSearching = false
    }
}

struct TrackRow: View {
    let track: Track
    let onTap: () -> Void
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites

    private var isCurrentlyPlaying: Bool {
        player.currentTrack?.id == track.id
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: track.artworkUrl ?? "")) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.accentColor.opacity(0.2))
                        .overlay {
                            Image(systemName: "music.note")
                                .font(.caption)
                                .foregroundStyle(Color.accentColor)
                        }
                }
                .frame(width: 44, height: 44)
                .clipShape(RoundedRectangle(cornerRadius: 6))

                VStack(alignment: .leading, spacing: 2) {
                    Text(track.title)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(isCurrentlyPlaying ? Color.accentColor : .primary)
                        .lineLimit(1)
                    HStack(spacing: 4) {
                        Text(track.artist)
                        if track.duration > 0 {
                            Text("·")
                            Text(track.durationText)
                        }
                    }
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                }

                Spacer()

                if isCurrentlyPlaying && player.isPlaying {
                    Image(systemName: "waveform")
                        .foregroundStyle(Color.accentColor)
                        .symbolEffect(.variableColor.iterative)
                }

                Button { favorites.toggleTrack(track) } label: {
                    Image(systemName: favorites.isTrackFavorite(track) ? "heart.fill" : "heart")
                        .foregroundStyle(favorites.isTrackFavorite(track) ? .red : .secondary)
                        .font(.subheadline)
                }
                .buttonStyle(.plain)
            }
        }
        .buttonStyle(.plain)
    }
}
