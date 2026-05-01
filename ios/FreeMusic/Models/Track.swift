import Foundation

enum MusicSource: String, Codable {
    case jamendo
    case radio
    case internetArchive
    case ccmixter
}

struct Track: Identifiable, Codable, Hashable {
    let id: String
    let title: String
    let artist: String
    var album: String?
    var duration: Int // seconds
    let streamUrl: String
    var artworkUrl: String?
    let source: MusicSource

    var durationText: String {
        let m = duration / 60
        let s = duration % 60
        return String(format: "%d:%02d", m, s)
    }
}

struct RadioStation: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let streamUrl: String
    var genre: String?
    var country: String?
    var favicon: String?

    var displayGenre: String? {
        genre?.split(separator: ",").first.map(String.init)
    }
}
