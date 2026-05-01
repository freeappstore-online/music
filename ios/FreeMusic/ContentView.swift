import SwiftUI

struct ContentView: View {
    @Environment(AudioPlayer.self) private var player

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView {
                HomeTab()
                    .tabItem {
                        Label("Home", systemImage: "house.fill")
                    }
                SearchTab()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
                RadioTab()
                    .tabItem {
                        Label("Radio", systemImage: "radio.fill")
                    }
                FavoritesTab()
                    .tabItem {
                        Label("Favorites", systemImage: "heart.fill")
                    }
            }
            .tint(Color.accentColor)

            if player.currentTrack != nil || player.currentStation != nil {
                MiniPlayerBar()
                    .padding(.bottom, 49) // above tab bar
            }
        }
        .preferredColorScheme(.dark)
    }
}
