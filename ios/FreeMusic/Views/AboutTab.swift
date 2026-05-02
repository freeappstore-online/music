import SwiftUI

struct AboutTab: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Hero
                    VStack(spacing: 12) {
                        Text("Music belongs to everyone.")
                            .font(.title.weight(.bold))
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)

                        Text("600,000+ Creative Commons tracks. 30,000+ live radio stations. Public domain recordings. Zero cost, forever.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 8)
                    .padding(.horizontal)

                    // Stats
                    HStack(spacing: 1) {
                        StatBox(value: "600K+", label: "Free Tracks")
                        StatBox(value: "30K+", label: "Stations")
                        StatBox(value: "$0", label: "Forever")
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .padding(.horizontal)

                    // Features
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Why FreeMusic")
                            .font(.headline)
                            .padding(.horizontal)

                        FeatureRow(icon: "music.note", title: "No Ads, Ever", desc: "No audio ads. No banners. No sponsored playlists. Just music.")
                        FeatureRow(icon: "lock.open", title: "No Account Required", desc: "No sign-up, no email. Open and start listening immediately.")
                        FeatureRow(icon: "eye.slash", title: "No Tracking", desc: "We don't collect data. No analytics. Your music is your business.")
                        FeatureRow(icon: "iphone", title: "Works Everywhere", desc: "iOS app, web PWA, any browser. Your music follows you.")
                        FeatureRow(icon: "radio", title: "Live Radio", desc: "30,000+ stations from every country and genre on earth.")
                        FeatureRow(icon: "speaker.wave.2", title: "Background Playback", desc: "Lock your phone, switch apps — music keeps playing.")
                    }

                    // Values
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Our Values")
                            .font(.headline)
                            .padding(.horizontal)

                        ValueRow(text: "Open source. Code on GitHub. Anyone can inspect or contribute.")
                        ValueRow(text: "Artist-first. We credit artists and respect their licenses.")
                        ValueRow(text: "No venture capital. No investors pushing monetization.")
                        ValueRow(text: "Privacy by design. No accounts, no analytics, no data collection.")
                        ValueRow(text: "Forever free. Not freemium. Not \"free with ads.\" Free. Period.")
                    }

                    // Sources
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Sources")
                            .font(.headline)
                            .padding(.horizontal)
                        Text("All music is Creative Commons licensed or public domain.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal)
                        HStack(spacing: 8) {
                            sourceChip("Jamendo")
                            sourceChip("ccMixter")
                            sourceChip("Internet Archive")
                            sourceChip("Radio Browser")
                        }
                        .padding(.horizontal)
                    }

                    Text("© 2026 FreeMusic. Open source, open music.")
                        .font(.caption2)
                        .foregroundStyle(Color.brandMuted)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 8)
                        .padding(.bottom, 80)
                }
                .padding(.top)
            }
            .background(Color.brandBg)
            .navigationTitle("About")
        }
    }

    private func sourceChip(_ name: String) -> some View {
        Text(name)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color.accentColor.opacity(0.15))
            .foregroundStyle(Color.accentColor)
            .clipShape(Capsule())
    }
}

private struct StatBox: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2.weight(.bold))
                .foregroundStyle(Color.accentColor)
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
        .background(Color.brandSurface)
    }
}

private struct FeatureRow: View {
    let icon: String
    let title: String
    let desc: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.body)
                .foregroundStyle(Color.accentColor)
                .frame(width: 28, height: 28)
                .background(Color.accentColor.opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                Text(desc)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal)
    }
}

private struct ValueRow: View {
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "checkmark")
                .font(.caption.weight(.bold))
                .foregroundStyle(Color.accentColor)
                .frame(width: 20, height: 20)
                .background(Color.accentColor.opacity(0.15))
                .clipShape(Circle())
            Text(text)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal)
    }
}
