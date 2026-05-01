import Foundation
import os

struct Log {
    private static let logger = Logger(subsystem: "com.freemusic.app", category: "general")

    static func info(_ message: String) {
        logger.info("[FM] \(message)")
        fputs("[FM] \(message)\n", stderr)
    }

    static func error(_ message: String) {
        logger.error("[FM ERROR] \(message)")
        fputs("[FM ERROR] \(message)\n", stderr)
    }
}
