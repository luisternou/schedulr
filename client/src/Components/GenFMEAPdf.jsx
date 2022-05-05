import React from "react";
import jsPDF from "jspdf";
import languageData from "../config/Languages.json";
import verdictData from "../config/Verdict.json";
class GenFMEAPdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  genPdf = () => {
    let language = this.props.pdfLanguage;
    const fmeaData = this.props.data;

    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "-" + mm + "-" + yyyy;
    let date = dd + "/" + mm + "/" + yyyy;
    doc.setFontSize(40);
    doc.text(
      languageData.generatepdf_fmea_report[language],
      100,
      20,
      null,
      null,
      "center"
    );
    doc.setFontSize(14);
    doc.text(
      languageData.generatepdf_submitted_by[language] +
        ": " +
        fmeaData.createdByName,
      200,
      30,
      null,
      null,
      "right"
    );
    doc.text(
      languageData.generatepdf_on[language] + date,
      200,
      35,
      null,
      null,
      "right"
    );
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(fmeaData.fmeaType, 100, 40, null, null, "center");
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(languageData.fmea_project_name[language], 10, 75);
    doc.text(fmeaData.projectName, 200, 75, null, null, "right");
    doc.line(10, 80, 200, 80);

    doc.text(languageData.fmea_project_number[language], 10, 90);
    doc.text(fmeaData.projectNumber, 200, 90, null, null, "right");
    doc.line(10, 95, 200, 95);

    doc.text(languageData.fmea_model[language], 10, 105);
    doc.text(fmeaData.model, 200, 105, null, null, "right");
    doc.line(10, 110, 200, 110);

    doc.text(languageData.fmea_change_state[language], 10, 120);
    doc.text(fmeaData.changeState, 200, 120, null, null, "right");
    doc.line(10, 125, 200, 125);

    doc.text(languageData.fmea_owner[language], 10, 135);
    doc.text(fmeaData.owner, 200, 135, null, null, "right");
    doc.line(10, 140, 200, 140);

    doc.text(languageData.fmea_effort[language], 10, 150);
    doc.text(fmeaData.effort.toString(), 200, 150, null, null, "right");
    doc.line(10, 155, 200, 155);

    doc.setFont("helvetica", "bold");
    doc.text(
      languageData.generatepdf_functions_on_following_page[language],
      100,
      170,
      null,
      null,
      "center"
    );

    for (let index = 0; index < fmeaData.functions.length; index++) {
      doc.addPage("a4", "p");
      // initial state
      doc.setFontSize(16);
      doc.text(
        languageData.fmea_function[language] + " " + (index + 1).toString(),
        100,
        20,
        null,
        null,
        "center"
      );
      doc.setFont("helvetica", "normal");

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(
        languageData.generatepdf_original_state[language],
        100,
        40,
        null,
        null,
        "center"
      );

      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");

      doc.text(languageData.fmea_function[language], 10, 55);
      doc.text(
        fmeaData.functions[index].function,
        200,
        55,
        null,
        null,
        "right"
      );
      doc.line(10, 60, 200, 60);

      doc.text(languageData.fmea_failure_mode[language], 10, 70);
      doc.text(
        fmeaData.functions[index].failureMode,
        200,
        70,
        null,
        null,
        "right"
      );
      doc.line(10, 75, 200, 75);

      doc.text(languageData.fmea_failure_effect[language], 10, 85);
      doc.text(
        fmeaData.functions[index].failureEffect,
        200,
        85,
        null,
        null,
        "right"
      );
      doc.line(10, 90, 200, 90);

      doc.text(languageData.fmea_severity[language], 10, 100);
      doc.text(
        fmeaData.functions[index].severity.toString(),
        200,
        100,
        null,
        null,
        "right"
      );
      doc.line(10, 105, 200, 105);

      doc.text(languageData.fmea_cause[language], 10, 115);
      doc.text(fmeaData.functions[index].cause, 200, 115, null, null, "right");
      doc.line(10, 120, 200, 120);

      doc.text(languageData.fmea_occurrence[language], 10, 130);
      doc.text(
        fmeaData.functions[index].occurrence.toString(),
        200,
        130,
        null,
        null,
        "right"
      );
      doc.line(10, 135, 200, 135);

      doc.text(languageData.fmea_current_control[language], 10, 145);
      doc.text(
        fmeaData.functions[index].currentControl,
        200,
        145,
        null,
        null,
        "right"
      );
      doc.line(10, 150, 200, 150);

      doc.text(languageData.fmea_detection[language], 10, 160);
      doc.text(
        fmeaData.functions[index].detection.toString(),
        200,
        160,
        null,
        null,
        "right"
      );
      doc.line(10, 165, 200, 165);

      doc.setFontSize(24);
      doc.text(
        languageData.fmea_rpn[language] + ": " + fmeaData.functions[index].rpn,
        100,
        180,
        null,
        null,
        "center"
      );
      doc.setFontSize(16);
      let verdictCategory = null;
      if (fmeaData.functions[index].rpn === 1) {
        verdictCategory = "no_risk";
      }
      if (
        fmeaData.functions[index].rpn >= 2 &&
        fmeaData.functions[index].rpn <= 50
      ) {
        verdictCategory = "acceptable";
      }

      if (
        fmeaData.functions[index].rpn >= 51 &&
        fmeaData.functions[index].rpn <= 100
      ) {
        verdictCategory = "medium";
      }
      if (
        fmeaData.functions[index].rpn >= 101 &&
        fmeaData.functions[index].rpn <= 1000
      ) {
        verdictCategory = "high";
      }
      doc.text(
        languageData.verdict_with_an_rpn_part_one[language] +
          fmeaData.functions[index].rpn +
          languageData.verdict_with_an_rpn_part_two[language],
        10,
        195
      );
      doc.setFont("helvetica", "bold");
      doc.text(languageData.verdict_failure_risk[language], 10, 210);
      doc.setFont("helvetica", "normal");
      doc.text(verdictData[verdictCategory].risk_of_failure[language], 10, 220);
      doc.setFont("helvetica", "bold");
      doc.text(languageData.verdict_need_for_action[language], 10, 230);
      doc.setFont("helvetica", "normal");
      doc.text(verdictData[verdictCategory].need_for_action[language], 10, 240);
      doc.setFont("helvetica", "bold");
      doc.text(languageData.verdict_measures[language], 10, 250);
      doc.setFont("helvetica", "normal");
      doc.text(verdictData[verdictCategory].measures[language], 10, 260);
    }

    // Improved state

    if (fmeaData.improvedFunctions && fmeaData.improvedFunctions.length > 0) {
      for (let index = 0; index < fmeaData.functions.length; index++) {
        if (!fmeaData.improvedFunctions[index]) {
          continue;
        }
        doc.addPage("a4", "p");
        doc.setFontSize(16);
        doc.text(
          languageData.fmea_function[language] + " " + (index + 1).toString(),
          100,
          20,
          null,
          null,
          "center"
        );
        doc.setFont("helvetica", "normal");

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(
          languageData.generatepdf_improved_state[language],
          100,
          40,
          null,
          null,
          "center"
        );

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");

        doc.text(languageData.fmea_function[language], 10, 55);
        doc.text(
          fmeaData.functions[index].function,
          200,
          55,
          null,
          null,
          "right"
        );
        doc.line(10, 60, 200, 60);

        doc.text(languageData.fmea_failure_mode[language], 10, 70);
        doc.text(
          fmeaData.functions[index].failureMode,
          200,
          70,
          null,
          null,
          "right"
        );
        doc.line(10, 75, 200, 75);

        doc.text(languageData.fmea_failure_effect[language], 10, 85);
        doc.text(
          fmeaData.functions[index].failureEffect,
          200,
          85,
          null,
          null,
          "right"
        );
        doc.line(10, 90, 200, 90);

        doc.text(languageData.fmea_severity[language], 10, 100);
        doc.text(
          fmeaData.functions[index].severity_improved.toString(),
          200,
          100,
          null,
          null,
          "right"
        );
        doc.line(10, 105, 200, 105);

        doc.text(languageData.fmea_cause[language], 10, 115);
        doc.text(
          fmeaData.functions[index].cause,
          200,
          115,
          null,
          null,
          "right"
        );
        doc.line(10, 120, 200, 120);

        // doc.text(languageData.fmea_occurrence[language], 10, 130);
        // doc.text(
        //   fmeaData.functions[index].occurrence.toString(),
        //   200,
        //   130,
        //   null,
        //   null,
        //   "right"
        // );
        doc.line(10, 135, 200, 135);
        doc.text(languageData.fmea_occurrence[language], 10, 130);
        doc.text(
          fmeaData.functions[index].occurrence_improved.toString(),
          200,
          130,
          null,
          null,
          "right"
        );
        doc.line(10, 135, 200, 135);

        doc.text(languageData.fmea_improvements_made[language], 10, 145);

        doc.text(
          fmeaData.functions[index].improvementsMade,
          200,
          145,
          null,
          null,
          "right"
        );
        doc.line(10, 150, 200, 150);

        doc.text(languageData.fmea_detection[language], 10, 160);
        doc.text(
          fmeaData.functions[index].detection_improved.toString(),
          200,
          160,
          null,
          null,
          "right"
        );
        doc.line(10, 165, 200, 165);

        doc.setFontSize(24);
        doc.text(
          languageData.fmea_rpn[language] +
            ": " +
            +fmeaData.improvedFunctions[index].rpn_improved.toString(),
          100,
          180,
          null,
          null,
          "center"
        );
        let verdictCategory = null;
        if (fmeaData.functions[index].rpn_improved === 1) {
          verdictCategory = "no_risk";
        }
        if (
          fmeaData.functions[index].rpn_improved >= 2 &&
          fmeaData.functions[index].rpn_improved <= 50
        ) {
          verdictCategory = "acceptable";
        }

        if (
          fmeaData.functions[index].rpn_improved >= 51 &&
          fmeaData.functions[index].rpn_improved <= 100
        ) {
          verdictCategory = "medium";
        }
        if (
          fmeaData.functions[index].rpn_improved >= 101 &&
          fmeaData.functions[index].rpn_improved <= 1000
        ) {
          verdictCategory = "high";
        }
        doc.setFontSize(16);

        doc.text(
          languageData.verdict_with_an_rpn_part_one[language] +
            fmeaData.improvedFunctions[index].rpn_improved.toString() +
            languageData.verdict_with_an_rpn_part_two[language],
          10,
          195
        );
        doc.setFont("helvetica", "bold");
        doc.text(languageData.verdict_failure_risk[language], 10, 210);
        doc.setFont("helvetica", "normal");
        doc.text(
          verdictData[verdictCategory].risk_of_failure[language],
          10,
          220
        );
        doc.setFont("helvetica", "bold");
        doc.text(languageData.verdict_need_for_action[language], 10, 230);
        doc.setFont("helvetica", "normal");
        doc.text(
          verdictData[verdictCategory].need_for_action[language],
          10,
          240
        );
        doc.setFont("helvetica", "bold");
        doc.text(languageData.verdict_measures[language], 10, 250);
        doc.setFont("helvetica", "normal");
        doc.text(verdictData[verdictCategory].measures[language], 10, 260);
      }
    }

    doc.save(fmeaData.projectName + "-" + today);
  };

  render() {
    return (
      <div>
        <button
          onClick={this.genPdf}
          type="primary"
          className="w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-lg shadow-md lg:shadow-lg 
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
        >
          <i className="fas fa-file-pdf fa 1x w-6  -ml-2" />
          {languageData.generatepdf_generate_pdf[this.props.pdfLanguage]}
        </button>
      </div>
    );
  }
}

export default GenFMEAPdf;
