# LaundryPro

A mobile and web application for managing your wardrobe and tracking laundry items. Keep track of your clothes, send items to laundry, and monitor what's available vs. what's in the wash.

## Features

- **Wardrobe Management**: Add and manage clothing categories with total, available, and in-laundry counts
- **Batch Tracking**: Create batches when sending items to laundry with date tracking
- **Status Overview**: View real-time summary of all items across categories
- **Data Backup & Restore**: Export and import your data as JSON files
- **Cross-Platform**: Works on iOS, Android, and Web

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Usage

### Overview Tab
View current status of all items with totals, available count, and items in laundry.

### Send Tab
Select items and quantities to create a batch for sending to laundry.

### History Tab
View active laundry batches and mark them as returned when items come back.

### Wardrobe Tab
- Add new clothing categories
- Manage inventory with increment/decrement counters
- Delete categories when no longer needed

### Backup & Restore
Use the bottom bar to backup your data to a JSON file or restore from a previous backup.

## Project Structure

```
laundrypro/
├── app/
│   └── (tabs)/
│       ├── overview.jsx    # Status overview with summary
│       ├── send.jsx        # Create laundry batches
│       ├── history.jsx     # Active batches management
│       └── wardrobe.jsx    # Manage wardrobe items
├── contexts/
│   └── WardrobeContext.jsx # Global state management
└── components/
    └── ui/                  # UI components (Navbar, TabBar, BottomBar)
```

## Tech Stack

- **React Native** with **Expo**
- **Expo Router** for navigation
- **AsyncStorage** for local data persistence
- **React Context API** for state management

## Data Model

Each wardrobe item maintains:
- `total`: Total number of items owned
- `available`: Items currently available to use
- `inLaundry`: Items currently at the laundry