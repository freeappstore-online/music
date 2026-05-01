import Foundation

struct RadioBrowserService {
    private static let base = "https://de1.api.radio-browser.info/json"

    static func search(_ query: String, limit: Int = 20) async -> [RadioStation] {
        guard let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "\(base)/stations/byname/\(encoded)?limit=\(limit)&order=clickcount&reverse=true") else { return [] }
        return await fetch(url)
    }

    static func topStations(limit: Int = 20) async -> [RadioStation] {
        guard let url = URL(string: "\(base)/stations/topclick/\(limit)") else { return [] }
        return await fetch(url)
    }

    static func byGenre(_ genre: String, limit: Int = 20) async -> [RadioStation] {
        guard let encoded = genre.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "\(base)/stations/bytag/\(encoded)?limit=\(limit)&order=clickcount&reverse=true") else { return [] }
        return await fetch(url)
    }

    private static func fetch(_ url: URL) async -> [RadioStation] {
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let raw = try JSONDecoder().decode([RawStation].self, from: data)
            return raw.map { $0.toStation() }
        } catch {
            Log.error("RadioBrowser fetch failed: \(error)")
            return []
        }
    }
}

private struct RawStation: Decodable {
    let stationuuid: String
    let name: String
    let url_resolved: String?
    let url: String
    let tags: String?
    let country: String?
    let favicon: String?

    func toStation() -> RadioStation {
        RadioStation(
            id: "radio-\(stationuuid)",
            name: name,
            streamUrl: url_resolved ?? url,
            genre: tags,
            country: country,
            favicon: (favicon?.isEmpty == false) ? favicon : nil
        )
    }
}
