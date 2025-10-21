# Instagram Post Creator

An application for creating stunning, professional Instagram learning content posts with multiple templates, themes, and extensive customization options.

## ✨ Features

### 🎨 **Multiple Templates**

- **Modern Template**: Clean design with decorative circles and gradient backgrounds
- **Minimal Template**: Centered layout with accent border and focused typography
- **Gradient Template**: Boxed content area with gradient backgrounds and structured layout

### 🎭 **Theme Support**

- **Dark Theme**: Professional dark background with teal accents
- **Light Theme**: Clean white background with teal accents
- **Teal Theme**: Full teal background for vibrant, eye-catching posts

### 📝 **Text Customization**

#### Title Controls

- **Font Size**: Adjustable from 50px to 100px
- **Font Weight**: Regular (400), Semi-bold (600), Bold (700), Extra Bold (800)
- **Vertical Position**: Precise positioning from 50px to 300px

#### Content Controls

- **Font Size**: Adjustable from 30px to 60px
- **Font Weight**: Regular (400), Semi-bold (600), Bold (700), Extra Bold (800)
- **Vertical Position**: Precise positioning from 200px to 600px
- **Dynamic Line Height**: Automatically scales (1.3x font size) for optimal readability
- **Line Breaks Support**: Respects Enter key presses for manual line breaks

#### Footer/Brand

- **Brand Name**: Customizable footer text (max 30 characters)
- **Tagline**: "Tech Tips & Learning Resources"

### 💻 **Code Section** (Optional)

- **Toggle**: Show/hide code snippets
- **Code Box Height**: Adjustable from 150px to 350px
- **Syntax Support**: Multi-line code with truncation for long lines
- **Monospace Font**: Professional code display

### 🎯 **Visual Elements**

- **Next Arrow Indicator**: Optional arrow showing post continuation
- **Decorative Elements**: Template-specific circles and gradients
- **Responsive Layout**: Optimized for Instagram's 1080x1350 format

### 💾 **Saved Configurations**

- **Save Current Settings**: Save your current post configuration with a custom name
- **One-Click Loading**: Instantly apply any saved configuration to recreate posts
- **Persistent Storage**: Configurations are saved locally and persist between sessions
- **Export/Import**: Share configurations between devices or backup your settings
  - Individual config export as JSON files
  - Bulk export of all configurations
  - Import configurations from files (prevents duplicates)
- **Configuration Management**:
  - Rename saved configurations inline
  - Delete unwanted configurations
  - Copy configuration details to clipboard
  - Rich metadata display (template, theme, creation date)

### ⌨️ **Keyboard Shortcuts**

- **Ctrl+S**: Quick save current configuration
- **Ctrl+L**: Jump to saved configurations section
- **Ctrl+E**: Export all configurations (when configs exist)
- **Smart Detection**: Shortcuts only work when not typing in input fields

## 🎛 **User Interface**

### **Control Panel** (Left Sidebar)

- **Configuration Section**: Save/load controls and keyboard shortcut help
- Template and theme selectors at the top
- Title customization controls
- Content customization controls
- Footer/brand settings
- Visual element toggles
- Code section controls (when enabled)

### **Saved Configurations Panel** (Below Canvas)

- Display of all saved configurations
- Load, export, rename, and delete operations
- Import configurations from files
- Rich metadata and preview information

## 🔧 **Customization Tips**

- **Font Sizing**: Larger fonts work well for titles, smaller for detailed content
- **Positioning**: Use vertical position controls to create visual hierarchy
- **Code Sections**: Enable for technical tutorials, disable for simple text posts
- **Templates**: Modern for general content, Minimal for focused messaging, Gradient for structured layouts

## 📱 **Instagram Optimization**

- **Canvas Size**: 1080x1350 pixels (9:16 aspect ratio)
- **Text Readability**: Tested for mobile viewing
- **Export Functionality**: High-quality PNG download for individual posts and JSON export for configurations
- **File Format**: PNG with transparency support

## 🚀 **Technology Stack**

- **React 18** with TypeScript
- **Canvas API** for custom rendering
- **Tailwind CSS** for styling
- **Lucide Icons** for UI elements
- **Vite** for build tooling

## 📦 **Component Architecture**

The app is built with a modular component system:

### **Core Components**
- `PostCreator.tsx` - Main application component with canvas rendering
- `PostCanvas.tsx` - Canvas display and download wrapper
- `AppHeader.tsx` - Application header component

### **Configuration Components**
- `SavedConfigs.tsx` - Configuration management interface
- `SavedConfigsContext.tsx` - React context for configuration state management
- `useSavedConfigs.tsx` - Custom hook for accessing saved configurations

### **Control Components**
- `TemplateSelector.tsx` - Template selection interface
- `ThemeSelector.tsx` - Theme selection with visual previews
- `InputControl.tsx` - Reusable text input with character counting
- `SliderControl.tsx` - Range sliders for numeric values
- `SelectControl.tsx` - Dropdown selectors for options
- `ToggleControl.tsx` - Boolean toggle switches

### **Utility & Types**
- `configStorage.ts` - Local storage utilities for configurations
- `config.ts` - TypeScript type definitions for configurations

## 🚧 **Development**

### **Running Locally**

```bash
npm install
npm run dev
```

### **Building for Production**

```bash
npm run build
npm run preview
```

## 📄 **License**

This project is open source and available under the MIT License.

---

_Create stunning Instagram learning content with professional templates, themes, and precise typography controls. Save, share, and manage your configurations effortlessly with built-in export/import functionality and keyboard shortcuts for maximum productivity._
