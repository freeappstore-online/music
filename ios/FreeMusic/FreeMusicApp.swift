import SwiftUI

@main
struct FreeMusicApp: App {
    @State private var player = AudioPlayer()
    @State private var favorites = FavoritesManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(player)
                .environment(favorites)
        }
    }
}
