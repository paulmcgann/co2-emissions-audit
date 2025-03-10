# CO2 Emission Audit

&#x20;&#x20;

## 🌍 Purpose & Motivation

Modern web applications can be **energy-intensive**, leading to **higher carbon footprints**. The **CO2EmissionWebpackPlugin** aims to **quantify and reduce web-related carbon emissions** by analyzing Webpack output files and their environmental impact.

By using this plugin, developers can:

- **Measure** the carbon emissions of each file in a Webpack build.
- **Set thresholds** to prevent excessive energy consumption.
- **Grade file emissions** using the **Digital Carbon Rating Scale**.
- **Fail the build** if emissions exceed a specified level.
- **Generate reports** in **JSON and CSV** formats for sustainability tracking.

## 🚀 Features

- ✅ **CO₂ Emission Calculation** per file & total build
- ✅ **Threshold Checking** to flag oversized assets
- ✅ **Digital Carbon Rating Scale** for grading sustainability
- ✅ **Build Failure Option** for excessive CO₂ emissions
- ✅ **CSV & JSON Reports** for tracking and optimization
- ✅ **Customizable** thresholds and failure levels

## 📦 Installation

```sh
npm install --save-dev co2-emission-audit
```

or

```sh
yarn add -D co2-emission-audit
```

## ⚙️ Usage

Add the plugin to your Webpack configuration:

```javascript
const CO2EmissionAudit = require('co2-emission-audit');

module.exports = {
  // Other webpack configurations...
  plugins: [
    new CO2EmissionAudit({
      thresholds: {
        '.js': 0.005, // Max CO₂ per byte for JavaScript files
        '.css': 0.002,
        '.png': 0.005
      },
      failThreshold: 'D', // Fail build if total grade is D or worse
    })
  ]
};
```

### 📊 Report Output

After a Webpack build, the plugin generates:

- ``: A structured JSON report
- ``: A CSV file for tracking sustainability

Example console output:

```
CO₂ Emission Report:
┌───────────────┬──────────────┬───────────┬───────────────────────────┐
│ File         │ Size (bytes) │ CO₂ (g)   │ Grade                     │
├───────────────┼──────────────┼───────────┼───────────────────────────┤
│ main.js       │ 152340       │ 0.001523  │ B 🟢 (Good)               │
│ image.png     │ 905230       │ 0.009052  │ E 🔴 (Very High)          │
└───────────────┴──────────────┴───────────┴───────────────────────────┘
Total Build Size: 1095804 bytes
Total CO₂ Emissions: 0.010977 g
Overall Build Grade: C 🟡 (Moderate)
```

If emissions exceed thresholds, the build can **fail**:

```
ERROR in CO2EmissionAudit
Build failed due to high CO₂ emissions. Grade: D 🟠 (High)
```

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork the repository**
2. **Create a new branch** (`feature/new-feature`)
3. **Commit your changes**
4. **Open a pull request**

### Development Setup

Clone the repo and install dependencies:

```sh
git clone https://github.com/your-repo/co2-emission-audit.git
cd co2-emission-audit
npm install
```

Run tests:

```sh
npm test
```

## 🛠️ Maintainers

This project is maintained by **Paul McGann** and the **Open Source Community**. If you have any questions, feel free to **open an issue** or **submit a PR**.

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

🚀 **Let's build a more sustainable web, one optimized asset at a time!**

