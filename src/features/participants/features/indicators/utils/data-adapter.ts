import type { Daily_Assessment, IVCF_AssessmentWithDate } from "../types";

/**
 * Flattens Daily_Assessment[] into a single array of IVCF_AssessmentWithDate[]
 * Each assessment is preserved with its date attached
 */
export function flattenDailyAssessments(
  dailyAssessments: Daily_Assessment[],
): IVCF_AssessmentWithDate[] {
  return dailyAssessments.flatMap((daily) =>
    daily.assessments.map((assessment) => ({
      ...assessment,
      date: daily.date,
    })),
  );
}

/**
 * Extracts only the last assessment per day
 * Useful for aggregate views - represents the final assessment of the day
 */
export function getOnlyFirstAssessmentPerDay(
  dailyAssessments: Daily_Assessment[],
): IVCF_AssessmentWithDate[] {
  return dailyAssessments
    .filter((daily) => daily.assessments.length > 0)
    .map((daily) => ({
      ...daily.assessments[daily.assessments.length - 1],
      date: daily.date,
    }));
}

/**
 * Gets the most recent assessment from all daily assessments (last assessment of last day)
 */
export function getLatestAssessment(
  dailyAssessments: Daily_Assessment[],
): IVCF_AssessmentWithDate | null {
  if (dailyAssessments.length === 0) return null;

  const lastDay = dailyAssessments[dailyAssessments.length - 1];
  if (lastDay.assessments.length === 0) return null;

  return {
    ...lastDay.assessments[lastDay.assessments.length - 1],
    date: lastDay.date,
  };
}

/**
 * Gets the first baseline assessment (last assessment of first day)
 */
export function getFirstAssessment(
  dailyAssessments: Daily_Assessment[],
): IVCF_AssessmentWithDate | null {
  if (dailyAssessments.length === 0) return null;

  const firstDay = dailyAssessments[0];
  if (firstDay.assessments.length === 0) return null;

  return {
    ...firstDay.assessments[firstDay.assessments.length - 1],
    date: firstDay.date,
  };
}

/**
 * Prepares data for LinearScoreChart with intelligent handling of multiple assessments
 * Returns data with metadata about whether this is a primary or secondary assessment
 */
export interface LinearScoreChartData extends IVCF_AssessmentWithDate {
  isPrimaryAssessment: boolean;
  hasMultipleAssessmentsOnDay: boolean;
  assessmentIndexOnDay: number;
}

export function prepareLinearScoreChartData(
  dailyAssessments: Daily_Assessment[],
): LinearScoreChartData[] {
  return dailyAssessments.flatMap((daily) =>
    daily.assessments.map((assessment, index) => ({
      ...assessment,
      date: daily.date,
      isPrimaryAssessment: index === daily.assessments.length - 1,
      hasMultipleAssessmentsOnDay: daily.assessments.length > 1,
      assessmentIndexOnDay: index,
    })),
  );
}
