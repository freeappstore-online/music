import SwiftUI

struct FavoritesTab: View {
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites

    var body: some View {
        NavigationStack {
            List {
                if favorites.tracks.isEmpty && favorites.stations.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "heart")
                            .font(.system(size: 48))
                            .foregroundStyle(.secondary)
                        Text("No favorites yet")
                            .font(.headline)
                            .foregroundStyle(.secondary)
                        Text("Tap the heart icon on any track or station to save it here.")
                            .font(.subheadline)
                            .foregroundStyle(.tertiary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 60)
                    .listRowBackground(Color.clear)
                }

                if !favorites.tracks.isEmpty {
                    Section("Tracks") {
                        ForEach(favorites.tracks) { track in
                            TrackRow(track: track) {
                                player.playTrack(track, queue: favorites.tracks, index: favorites.tracks.firstIndex(of: track) ?? 0)
                            }
                        }
                    }
                }

                if !favorites.stations.isEmpty {
                    Section("Stations") {
                        ForEach(favorites.stations) { station in
                            StationRow(station: station) {
                                player.playStation(station)
                            }
                        }
                    }
                }
            }
            .listStyle(.plain)
            .navigationTitle("Favorites")
            .contentMargins(.bottom, 80)
        }
    }
}
