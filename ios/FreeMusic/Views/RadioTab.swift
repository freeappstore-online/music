import SwiftUI

struct RadioTab: View {
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites
    @State private var stations: [RadioStation] = []
    @State private var isLoading = true
    @State private var searchQuery = ""

    var body: some View {
        NavigationStack {
            List {
                if isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .listRowBackground(Color.clear)
                } else if stations.isEmpty {
                    Text("No stations found")
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity)
                        .listRowBackground(Color.clear)
                } else {
                    ForEach(stations) { station in
                        StationRow(station: station) {
                            player.playStation(station)
                        }
                    }
                }
            }
            .listStyle(.plain)
            .navigationTitle("Radio")
            .searchable(text: $searchQuery, prompt: "Search stations...")
            .onSubmit(of: .search) {
                Task { await searchStations() }
            }
            .task { await loadTop() }
            .contentMargins(.bottom, 80)
        }
    }

    private func loadTop() async {
        isLoading = true
        stations = await RadioBrowserService.topStations(limit: 40)
        isLoading = false
    }

    private func searchStations() async {
        guard !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty else {
            await loadTop()
            return
        }
        isLoading = true
        stations = await RadioBrowserService.search(searchQuery, limit: 40)
        isLoading = false
    }
}

struct StationRow: View {
    let station: RadioStation
    let onTap: () -> Void
    @Environment(AudioPlayer.self) private var player
    @Environment(FavoritesManager.self) private var favorites

    private var isCurrentlyPlaying: Bool {
        player.currentStation?.id == station.id
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                if let favicon = station.favicon, let url = URL(string: favicon) {
                    AsyncImage(url: url) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        stationPlaceholder
                    }
                    .frame(width: 44, height: 44)
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                } else {
                    stationPlaceholder
                        .frame(width: 44, height: 44)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(station.name)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(isCurrentlyPlaying ? Color.accentColor : .primary)
                        .lineLimit(1)
                    HStack(spacing: 4) {
                        if let genre = station.displayGenre {
                            Text(genre)
                        }
                        if let country = station.country, !country.isEmpty {
                            Text("·")
                            Text(country)
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

                Button { favorites.toggleStation(station) } label: {
                    Image(systemName: favorites.isStationFavorite(station) ? "heart.fill" : "heart")
                        .foregroundStyle(favorites.isStationFavorite(station) ? .red : .secondary)
                        .font(.subheadline)
                }
                .buttonStyle(.plain)
            }
        }
        .buttonStyle(.plain)
    }

    private var stationPlaceholder: some View {
        RoundedRectangle(cornerRadius: 6)
            .fill(Color.accentColor.opacity(0.2))
            .overlay {
                Image(systemName: "radio.fill")
                    .font(.caption)
                    .foregroundStyle(Color.accentColor)
            }
    }
}
