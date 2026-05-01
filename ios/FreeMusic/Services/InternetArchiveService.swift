import Foundation

struct InternetArchiveService {
    private static let base = "https://archive.org"

    static func search(_ query: String, limit: Int = 10) async -> [Track] {
        guard let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(base)/advancedsearch.php?q=\(encoded)+mediatype:audio&fl[]=identifier,title,creator&rows=\(limit)&output=json") else { return [] }
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let response = try JSONDecoder().decode(IASearchResponse.self, from: data)
            let items = response.response.docs

            var tracks: [Track] = []
            await withTaskGroup(of: [Track].self) { group in
                for item in items.prefix(8) {
                    group.addTask { await fetchFiles(item: item) }
                }
                for await result in group {
                    tracks.append(contentsOf: result)
                }
            }
            return tracks
        } catch {
            Log.error("Internet Archive search failed: \(error)")
            return []
        }
    }

    private static func fetchFiles(item: IADoc) async -> [Track] {
        guard let url = URL(string: "\(base)/metadata/\(item.identifier)") else { return [] }
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let meta = try JSONDecoder().decode(IAMetadata.self, from: data)
            return meta.files
                .filter { $0.name.hasSuffix(".mp3") || $0.format == "VBR MP3" || $0.format == "MP3" }
                .prefix(3)
                .map { file in
                    Track(
                        id: "ia-\(item.identifier)-\(file.name)",
                        title: file.title ?? file.name.replacingOccurrences(of: ".mp3", with: ""),
                        artist: item.creator ?? "Unknown Artist",
                        album: item.title,
                        duration: parseDuration(file.length),
                        streamUrl: "\(base)/download/\(item.identifier)/\(file.name.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? file.name)",
                        artworkUrl: "\(base)/services/img/\(item.identifier)",
                        source: .internetArchive
                    )
                }
        } catch {
            return []
        }
    }

    private static func parseDuration(_ length: String?) -> Int {
        guard let length else { return 0 }
        let parts = length.split(separator: ":")
        if parts.count == 2, let m = Int(parts[0]), let s = Int(parts[1]) { return m * 60 + s }
        if parts.count == 3, let h = Int(parts[0]), let m = Int(parts[1]), let s = Int(parts[2]) { return h * 3600 + m * 60 + s }
        return Int(Double(length) ?? 0)
    }
}

private struct IASearchResponse: Decodable {
    let response: IAResponseBody
}

private struct IAResponseBody: Decodable {
    let docs: [IADoc]
}

private struct IADoc: Decodable {
    let identifier: String
    let title: String
    let creator: String?
}

private struct IAMetadata: Decodable {
    let files: [IAFile]
}

private struct IAFile: Decodable {
    let name: String
    let format: String?
    let title: String?
    let length: String?
}
