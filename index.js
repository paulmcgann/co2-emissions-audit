const { co2 } = require("@tgwf/co2");
const fs = require("fs");
const path = require("path");

class CO2EmissionAudit {
  constructor(options = {}) {
    this.thresholds = options.thresholds || {};
    this.failThreshold = options.failThreshold || "F"; // Default: fail on F or worse
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "CO2EmissionAudit",
      (compilation, callback) => {
        const outputFiles = Object.keys(compilation.assets);
        const fileStats = [];
        let totalSize = 0;
        let totalCO2 = 0;
        let warnings = [];

        const co2Calculator = new co2({ model: "1byte" });

        outputFiles.forEach((file) => {
          const asset = compilation.assets[file];
          const size = asset.size();
          const co2PerByte = co2Calculator.perByte(size);
          totalSize += size;
          totalCO2 += co2PerByte;

          // Convert bytes to MB for grading
          const sizeMB = size / (1024 * 1024);
          const co2PerMB = sizeMB > 0 ? co2PerByte / sizeMB : 0;
          const grade = this.getCarbonGrade(co2PerMB);

          // Get file extension to check threshold
          const ext = path.extname(file).toLowerCase();
          const threshold = this.thresholds[ext];

          // Check if file exceeds threshold
          if (threshold && co2PerByte > threshold) {
            warnings.push({
              file,
              co2: co2PerByte.toFixed(6) + " g",
              threshold: threshold.toFixed(6) + " g",
              grade,
            });
          }

          fileStats.push({
            file,
            size,
            co2: co2PerByte.toFixed(6) + " g",
            grade,
          });
        });

        // Calculate total grade for the build
        const totalSizeMB = totalSize / (1024 * 1024);
        const totalCo2PerMB = totalSizeMB > 0 ? totalCO2 / totalSizeMB : 0;
        const totalGrade = this.getCarbonGrade(totalCo2PerMB);

        // Save reports
        this.saveJsonReport(
          compiler,
          fileStats,
          totalSize,
          totalCO2,
          totalGrade,
          warnings
        );
        this.saveCsvReport(
          compiler,
          fileStats,
          totalSize,
          totalCO2,
          totalGrade
        );

        // Console Output
        console.log("CO₂ Emission Report:");
        console.table(fileStats);
        console.log(`Total Build Size: ${totalSize} bytes`);
        console.log(`Total CO₂ Emissions: ${totalCO2.toFixed(6)} g`);
        console.log(`Overall Build Grade: ${totalGrade}`);

        // Show warnings if thresholds exceeded
        if (warnings.length > 0) {
          console.warn(
            "\n⚠️  WARNING: Some files exceeded CO₂ emission thresholds:"
          );
          console.table(warnings);
        }

        // Fail build if grade is worse than allowed threshold
        if (this.shouldFailBuild(totalGrade)) {
          callback(
            new Error(
              `Build failed due to high CO₂ emissions. Grade: ${totalGrade}`
            )
          );
        } else {
          callback();
        }
      }
    );
  }

  /**
   * Assigns a grade based on CO₂ emissions per MB.
   */
  getCarbonGrade(co2PerMB) {
    if (co2PerMB <= 0.05) return "A 🟢 (Excellent)";
    if (co2PerMB <= 0.1) return "B 🟢 (Good)";
    if (co2PerMB <= 0.3) return "C 🟡 (Moderate)";
    if (co2PerMB <= 0.5) return "D 🟠 (High)";
    if (co2PerMB <= 1.0) return "E 🔴 (Very High)";
    return "F 🔥 (Extremely High)";
  }

  /**
   * Determines if the build should fail based on the configured grade threshold.
   */
  shouldFailBuild(grade) {
    const gradeOrder = ["A", "B", "C", "D", "E", "F"];
    const failIndex = gradeOrder.indexOf(this.failThreshold[0]);
    const buildIndex = gradeOrder.indexOf(grade[0]); // Extract letter only (e.g., "D" from "D 🟠")
    return buildIndex >= failIndex;
  }

  /**
   * Saves JSON report.
   */
  saveJsonReport(
    compiler,
    fileStats,
    totalSize,
    totalCO2,
    totalGrade,
    warnings
  ) {
    const report = {
      totalFiles: fileStats.length,
      totalSize: totalSize + " bytes",
      totalCO2: totalCO2.toFixed(6) + " g",
      totalGrade,
      files: fileStats,
      warnings,
    };

    const outputPath = path.resolve(
      compiler.options.output.path,
      "co2-report.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`JSON Report saved to ${outputPath}`);
  }

  /**
   * Saves CSV report.
   */
  saveCsvReport(compiler, fileStats, totalSize, totalCO2, totalGrade) {
    const csvData = [
      "file,size (bytes),co2 (g),grade",
      ...fileStats.map(
        ({ file, size, co2, grade }) => `${file},${size},${co2},${grade}`
      ),
      `TOTAL,${totalSize},${totalCO2.toFixed(6)} g,${totalGrade}`,
    ].join("\n");

    const outputPath = path.resolve(
      compiler.options.output.path,
      "co2-report.csv"
    );
    fs.writeFileSync(outputPath, csvData);
    console.log(`CSV Report saved to ${outputPath}`);
  }
}

module.exports = CO2EmissionAudit;