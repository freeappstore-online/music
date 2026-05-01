import SwiftUI

struct GenreView: View {
    let genre: String
    @Environment(AudioPlayer.self) private var player
    @State private var tracks: [Track] = []
    @State private var isLoading = true

    var body: some View {
        List {
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .listRowBackground(Color.clear)
            } else if tracks.isEmpty {
                Text("No tracks found")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
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
        .navigationTitle(genre.capitalized)
        .task { await loadGenre() }
        .contentMargins(.bottom, 80)
    }

    private func loadGenre() async {
        isLoading = true
        tracks = await JamendoService.byGenre(genre, limit: 40)
        isLoading = false
    }
}
