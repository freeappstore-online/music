import Foundation

@MainActor @Observable
final class FavoritesManager {
    var tracks: [Track] = []
    var stations: [RadioStation] = []

    private let tracksKey = "fm-favorite-tracks"
    private let stationsKey = "fm-favorite-stations"

    init() {
        load()
    }

    func isTrackFavorite(_ track: Track) -> Bool {
        tracks.contains { $0.id == track.id }
    }

    func isStationFavorite(_ station: RadioStation) -> Bool {
        stations.contains { $0.id == station.id }
    }

    func toggleTrack(_ track: Track) {
        if let idx = tracks.firstIndex(where: { $0.id == track.id }) {
            tracks.remove(at: idx)
        } else {
            tracks.insert(track, at: 0)
        }
        save()
    }

    func toggleStation(_ station: RadioStation) {
        if let idx = stations.firstIndex(where: { $0.id == station.id }) {
            stations.remove(at: idx)
        } else {
            stations.insert(station, at: 0)
        }
        save()
    }

    private func load() {
        if let data = UserDefaults.standard.data(forKey: tracksKey),
           let decoded = try? JSONDecoder().decode([Track].self, from: data) {
            tracks = decoded
        }
        if let data = UserDefaults.standard.data(forKey: stationsKey),
           let decoded = try? JSONDecoder().decode([RadioStation].self, from: data) {
            stations = decoded
        }
    }

    private func save() {
        if let data = try? JSONEncoder().encode(tracks) {
            UserDefaults.standard.set(data, forKey: tracksKey)
        }
        if let data = try? JSONEncoder().encode(stations) {
            UserDefaults.standard.set(data, forKey: stationsKey)
        }
    }
}
