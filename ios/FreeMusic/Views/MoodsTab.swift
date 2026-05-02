import SwiftUI

struct MoodItem: Identifiable {
    let id: String
    let label: String
    let icon: String
    let color: Color
    let tag: String
}

private let moods: [MoodItem] = [
    MoodItem(id: "happy", label: "Happy", icon: "face.smiling", color: .yellow, tag: "happy"),
    MoodItem(id: "sad", label: "Sad", icon: "cloud.rain", color: .blue, tag: "sad"),
    MoodItem(id: "chill", label: "Chill", icon: "leaf", color: .teal, tag: "chill"),
    MoodItem(id: "energetic", label: "Pump Up", icon: "flame", color: .red, tag: "energetic"),
    MoodItem(id: "romantic", label: "Romantic", icon: "heart", color: .pink, tag: "romantic"),
    MoodItem(id: "focus", label: "Focus", icon: "target", color: .indigo, tag: "ambient"),
    MoodItem(id: "workout", label: "Workout", icon: "figure.run", color: .green, tag: "workout"),
    MoodItem(id: "sleep", label: "Sleep", icon: "moon.fill", color: .gray, tag: "relaxation"),
]

private let occasions: [MoodItem] = [
    MoodItem(id: "party", label: "Party", icon: "party.popper", color: .purple, tag: "party"),
    MoodItem(id: "christmas", label: "Christmas", icon: "gift", color: .red, tag: "christmas"),
    MoodItem(id: "birthday", label: "Birthday", icon: "birthday.cake", color: .pink, tag: "celebration"),
    MoodItem(id: "summer", label: "Summer", icon: "sun.max", color: .orange, tag: "summer"),
    MoodItem(id: "road", label: "Road Trip", icon: "car", color: .cyan, tag: "road+trip"),
    MoodItem(id: "morning", label: "Morning", icon: "sunrise", color: .orange, tag: "morning"),
    MoodItem(id: "dinner", label: "Dinner", icon: "wineglass", color: .brown, tag: "lounge"),
    MoodItem(id: "study", label: "Study", icon: "book", color: .mint, tag: "study"),
]

struct MoodsTab: View {
    @Environment(AudioPlayer.self) private var player
    @State private var selectedMood: MoodItem?
    @State private var tracks: [Track] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Moods
                    Text("Moods")
                        .font(.title3.weight(.bold))
                        .padding(.horizontal)

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(moods) { mood in
                            MoodButton(mood: mood, isSelected: selectedMood?.id == mood.id) {
                                Task { await selectMood(mood) }
                            }
                        }
                    }
                    .padding(.horizontal)

                    // Occasions
                    Text("Occasions")
                        .font(.title3.weight(.bold))
                        .padding(.horizontal)

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(occasions) { mood in
                            MoodButton(mood: mood, isSelected: selectedMood?.id == mood.id) {
                                Task { await selectMood(mood) }
                            }
                        }
                    }
                    .padding(.horizontal)

                    // Tracks
                    if let mood = selectedMood {
                        HStack {
                            Text(mood.label)
                                .font(.title3.weight(.bold))
                            Spacer()
                            if !tracks.isEmpty {
                                Button("Play All") {
                                    player.playTrack(tracks[0], queue: tracks, index: 0)
                                }
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(Color.accentColor)
                            }
                        }
                        .padding(.horizontal)

                        if isLoading {
                            ProgressView()
                                .frame(maxWidth: .infinity)
                                .padding()
                        } else if tracks.isEmpty {
                            Text("No tracks found")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity)
                                .padding()
                        } else {
                            ForEach(tracks) { track in
                                MoodTrackRow(track: track, tracks: tracks)
                            }
                        }
                    }
                }
                .padding(.top)
                .padding(.bottom, 80)
            }
            .background(Color.brandBg)
            .navigationTitle("Moods")
        }
    }

    private func selectMood(_ mood: MoodItem) async {
        if selectedMood?.id == mood.id {
            selectedMood = nil
            tracks = []
            return
        }
        selectedMood = mood
        isLoading = true
        tracks = await JamendoService.byGenre(mood.tag, limit: 20)
        isLoading = false
        if let first = tracks.first {
            player.playTrack(first, queue: tracks, index: 0)
        }
    }
}

private struct MoodButton: View {
    let mood: MoodItem
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: mood.icon)
                    .font(.title3)
                Text(mood.label)
                    .font(.caption2.weight(.semibold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(
                LinearGradient(colors: [mood.color.opacity(0.7), mood.color.opacity(0.3)],
                               startPoint: .topLeading, endPoint: .bottomTrailing)
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(isSelected ? Color.accentColor : .clear, lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
    }
}

private struct MoodTrackRow: View {
    let track: Track
    let tracks: [Track]
    @Environment(AudioPlayer.self) private var player

    var body: some View {
        Button {
            player.playTrack(track, queue: tracks, index: tracks.firstIndex(of: track) ?? 0)
        } label: {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: track.artworkUrl ?? "")) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.accentColor.opacity(0.15))
                        .overlay {
                            Image(systemName: "music.note")
                                .font(.caption)
                                .foregroundStyle(Color.accentColor)
                        }
                }
                .frame(width: 44, height: 44)
                .clipShape(RoundedRectangle(cornerRadius: 6))

                VStack(alignment: .leading, spacing: 2) {
                    Text(track.title)
                        .font(.subheadline.weight(.medium))
                        .lineLimit(1)
                    Text(track.artist)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
                Spacer()
            }
            .padding(.horizontal)
            .padding(.vertical, 4)
        }
        .buttonStyle(.plain)
    }
}
