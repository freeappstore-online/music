import SwiftUI

// DESIGN.md brand colors
extension Color {
    static let brandBg = Color(red: 0.039, green: 0.039, blue: 0.043)       // #0A0A0B
    static let brandSurface = Color(red: 0.082, green: 0.082, blue: 0.090)   // #151517
    static let brandBorder = Color(red: 0.137, green: 0.137, blue: 0.149)    // #232326
    static let brandMuted = Color(red: 0.471, green: 0.471, blue: 0.494)     // #78787E
}

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
                MoodsTab()
                    .tabItem {
                        Label("Moods", systemImage: "face.smiling.fill")
                    }
                FavoritesTab()
                    .tabItem {
                        Label("Favorites", systemImage: "heart.fill")
                    }
            }
            .tint(Color.accentColor)

            if player.currentTrack != nil || player.currentStation != nil {
                MiniPlayerBar()
                    .padding(.bottom, 49)
            }
        }
        .preferredColorScheme(.dark)
        .onAppear {
            // Brand the tab bar
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = UIColor(Color.brandBg.opacity(0.95))
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance

            // Brand the nav bar
            let navAppearance = UINavigationBarAppearance()
            navAppearance.configureWithOpaqueBackground()
            navAppearance.backgroundColor = UIColor(Color.brandBg)
            navAppearance.titleTextAttributes = [.foregroundColor: UIColor.white]
            navAppearance.largeTitleTextAttributes = [.foregroundColor: UIColor.white]
            UINavigationBar.appearance().standardAppearance = navAppearance
            UINavigationBar.appearance().scrollEdgeAppearance = navAppearance
        }
    }
}
