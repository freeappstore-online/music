import SwiftUI

struct HomeTab: View {
    @Environment(AudioPlayer.self) private var player
    @State private var trending: [Track] = []
    @State private var topStations: [RadioStation] = []
    @State private var isLoading = true

    private let genres = ["pop", "rock", "electronic", "jazz", "classical", "hiphop", "ambient", "metal", "dance", "oldies", "80s", "blues"]

    @Environment(FavoritesManager.self) private var favorites

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Tagline
                    Text("One tap. Your music. Right now.")
                        .font(.caption)
                        .foregroundStyle(Color.brandMuted)
                        .padding(.horizontal)

                    // Quick-play cards
                    HStack(spacing: 8) {
                        QuickPlayCard(
                            gradient: [Color.green.opacity(0.6), Color.green.opacity(0.15)],
                            icon: "radio.fill",
                            label: "Radio",
                            subtitle: favorites.stations.isEmpty ? "Top stations" : "\(favorites.stations.count) saved"
                        ) {
                            let stations = favorites.stations.isEmpty ? topStations : favorites.stations
                            if let first = stations.first { player.playStation(first) }
                        }
                        QuickPlayCard(
                            gradient: [Color.purple.opacity(0.6), Color.purple.opacity(0.15)],
                            icon: "heart.fill",
                            label: "My Tracks",
                            subtitle: favorites.tracks.isEmpty ? "Popular mix" : "\(favorites.tracks.count) saved"
                        ) {
                            let tracks = favorites.tracks.isEmpty ? trending : favorites.tracks
                            if let first = tracks.first { player.playTrack(first, queue: tracks, index: 0) }
                        }
                        QuickPlayCard(
                            gradient: [Color.orange.opacity(0.6), Color.orange.opacity(0.15)],
                            icon: "music.note",
                            label: "Genre",
                            subtitle: "Browse"
                        ) {
                            if let first = trending.first { player.playTrack(first, queue: trending, index: 0) }
                        }
                    }
                    .padding(.horizontal)

                    // Trending tracks
                    if !trending.isEmpty {
                        sectionHeader("Trending")
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

                    // Popular stations
                    if !topStations.isEmpty {
                        sectionHeader("Popular Stations")
                        ScrollView(.horizontal, showsIndicators: false) {
                            LazyHStack(spacing: 12) {
                                ForEach(topStations) { station in
                                    StationCard(station: station) {
                                        player.playStation(station)
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                            .padding()
                    }

                    // Genre grid
                    sectionHeader("Browse by Genre")
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ForEach(genres, id: \.self) { genre in
                            NavigationLink {
                                GenreView(genre: genre)
                            } label: {
                                GenreCard(genre: genre)
                            }
                        }
                    }
                    .padding(.horizontal)

                    // Sources
                    VStack(alignment: .leading, spacing: 8) {
                        Text("All music is Creative Commons or public domain. Free forever, no ads.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal)
                        HStack(spacing: 12) {
                            sourceChip("Radio Browser")
                            sourceChip("Internet Archive")
                            sourceChip("Jamendo")
                        }
                        .padding(.horizontal)
                    }
                    .padding(.bottom, 80)
                }
                .padding(.top)
            }
            .background(Color.brandBg)
            .navigationTitle("FreeMusic")
            .task { await loadContent() }
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

    private func loadContent() async {
        isLoading = true
        async let t = JamendoService.trending(limit: 20)
        async let s = RadioBrowserService.topStations(limit: 12)
        trending = await t
        topStations = await s
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

struct StationCard: View {
    let station: RadioStation
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 6) {
                if let favicon = station.favicon, let url = URL(string: favicon) {
                    AsyncImage(url: url) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        stationPlaceholder
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                } else {
                    stationPlaceholder
                        .frame(width: 100, height: 100)
                }
                Text(station.name)
                    .font(.caption.weight(.medium))
                    .lineLimit(1)
                Text(station.displayGenre ?? "Radio")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            .frame(width: 100)
        }
        .buttonStyle(.plain)
    }

    private var stationPlaceholder: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color.accentColor.opacity(0.15))
            .overlay {
                Image(systemName: "radio.fill")
                    .font(.title2)
                    .foregroundStyle(Color.accentColor)
            }
    }
}

struct QuickPlayCard: View {
    let gradient: [Color]
    let icon: String
    let label: String
    let subtitle: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Image(systemName: icon)
                        .font(.body)
                        .opacity(0.8)
                    Spacer()
                    Image(systemName: "play.circle.fill")
                        .font(.title3)
                        .opacity(0.6)
                }
                Spacer()
                Text(label)
                    .font(.caption.weight(.bold))
                Text(subtitle)
                    .font(.caption2)
                    .opacity(0.5)
            }
            .padding(12)
            .frame(maxWidth: .infinity, minHeight: 100, alignment: .leading)
            .background(
                LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
            )
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .strokeBorder(.white.opacity(0.06), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

struct GenreCard: View {
    let genre: String

    private let colors: [String: Color] = [
        "pop": .pink, "rock": .red, "electronic": .blue, "jazz": .orange,
        "classical": .brown, "hiphop": .purple, "ambient": .teal, "metal": .gray,
        "dance": .indigo, "oldies": .yellow, "80s": .mint, "blues": .cyan,
    ]

    var body: some View {
        Text(genre == "80s" ? "80's" : genre.capitalized)
            .font(.subheadline.weight(.semibold))
            .frame(maxWidth: .infinity)
            .frame(height: 48)
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
