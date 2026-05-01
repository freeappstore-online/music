import Foundation

struct JamendoService {
    static let clientId = "b6747d04"
    private static let base = "https://api.jamendo.com/v3.0"

    static func search(_ query: String, limit: Int = 20) async -> [Track] {
        guard let url = URL(string: "\(base)/tracks/?client_id=\(clientId)&format=json&limit=\(limit)&search=\(query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")") else { return [] }
        return await fetch(url)
    }

    static func trending(limit: Int = 20) async -> [Track] {
        guard let url = URL(string: "\(base)/tracks/?client_id=\(clientId)&format=json&limit=\(limit)&order=popularity_week") else { return [] }
        return await fetch(url)
    }

    static func byGenre(_ genre: String, limit: Int = 20) async -> [Track] {
        guard let url = URL(string: "\(base)/tracks/?client_id=\(clientId)&format=json&limit=\(limit)&tags=\(genre.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")&order=popularity_week") else { return [] }
        return await fetch(url)
    }

    private static func fetch(_ url: URL) async -> [Track] {
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let response = try JSONDecoder().decode(JamendoResponse.self, from: data)
            return response.results.map { $0.toTrack() }
        } catch {
            Log.error("Jamendo fetch failed: \(error)")
            return []
        }
    }
}

private struct JamendoResponse: Decodable {
    let results: [JamendoTrack]
}

private struct JamendoTrack: Decodable {
    let id: String
    let name: String
    let artist_name: String
    let album_name: String?
    let duration: Int
    let audio: String
    let album_image: String?
    let image: String?

    func toTrack() -> Track {
        Track(
            id: "jamendo-\(id)",
            title: name,
            artist: artist_name,
            album: album_name,
            duration: duration,
            streamUrl: audio,
            artworkUrl: album_image ?? image,
            source: .jamendo
        )
    }
}
