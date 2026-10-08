import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isUnderage, toggleGoal, toggleSensitivity } from './rules';
import { furthestOf, type StepId } from './steps';
import {
  EMPTY_ANSWERS,
  PHOTO_CONSENT_VERSION,
  type AgeBand,
  type Goal,
  type Lifestyle,
  type MonthlyBudget,
  type OnboardingAnswers,
  type OnboardingStatus,
  type RoutineLevel,
  type Sensitivity,
  type SkinType,
} from './types';

export interface OnboardingState {
  answers: OnboardingAnswers;
  status: OnboardingStatus;
  /** Furthest step reached, to resume where the user left off. */
  furthestStep: StepId | null;
  startedAt: string | null;
  completedAt: string | null;
  /** True when the server copy is behind the local answers. */
  pendingSync: boolean;
  hasHydrated: boolean;

  start: () => void;
  reachStep: (step: StepId) => void;
  setFirstName: (value: string) => void;
  setAgeBand: (value: AgeBand) => void;
  /** Leaves the under-16 screen: clears the answer and reopens the flow. */
  clearAgeBand: () => void;
  setSkinType: (value: SkinType) => void;
  toggleGoal: (value: Goal) => void;
  toggleSensitivity: (value: Sensitivity) => void;
  setRoutineLevel: (value: RoutineLevel) => void;
  setMonthlyBudget: (value: MonthlyBudget) => void;
  setLifestyle: (patch: Partial<Lifestyle>) => void;
  givePhotoConsent: (keepPhotos: boolean) => void;
  withdrawPhotoConsent: () => void;
  setKeepPhotos: (value: boolean) => void;
  setNotificationsOptIn: (value: boolean) => void;
  complete: () => void;
  markSynced: () => void;
  reset: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const ONBOARDING_STORAGE_KEY = 'lume.onboarding.v1';

const initialState = {
  answers: EMPTY_ANSWERS,
  status: 'not_started' as OnboardingStatus,
  furthestStep: null,
  startedAt: null,
  completedAt: null,
  pendingSync: false,
  hasHydrated: false,
};

/**
 * Onboarding answers, written locally at every step (the user can close the app and resume)
 * and synchronised to Supabase in the background. Nothing here is sent to analytics.
 */
export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => {
      const touch = (patch: (answers: OnboardingAnswers) => Partial<OnboardingAnswers>) =>
        set((state) => ({
          answers: { ...state.answers, ...patch(state.answers) },
          pendingSync: true,
        }));

      return {
        ...initialState,

        start: () =>
          set((state) => ({
            status: state.status === 'completed' ? 'completed' : 'in_progress',
            startedAt: state.startedAt ?? new Date().toISOString(),
          })),

        reachStep: (step) =>
          set((state) => ({
            furthestStep: furthestOf(state.furthestStep, step),
            status: state.status === 'not_started' ? 'in_progress' : state.status,
          })),

        setFirstName: (firstName) => touch(() => ({ firstName })),

        setAgeBand: (ageBand) => {
          touch(() => ({ ageBand }));
          set({ status: isUnderage(ageBand) ? 'blocked_age' : 'in_progress' });
        },

        clearAgeBand: () => {
          touch(() => ({ ageBand: null }));
          set({ status: 'in_progress' });
        },

        setSkinType: (skinType) => touch(() => ({ skinType })),

        toggleGoal: (goal) => touch((answers) => ({ goals: toggleGoal(answers.goals, goal) })),

        toggleSensitivity: (sensitivity) =>
          touch((answers) => ({
            sensitivities: toggleSensitivity(answers.sensitivities, sensitivity),
          })),

        setRoutineLevel: (routineLevel) => touch(() => ({ routineLevel })),

        setMonthlyBudget: (monthlyBudget) => touch(() => ({ monthlyBudget })),

        setLifestyle: (patch) =>
          touch((answers) => ({ lifestyle: { ...answers.lifestyle, ...patch } })),

        givePhotoConsent: (keepPhotos) =>
          touch(() => ({
            photoConsent: {
              acceptedAt: new Date().toISOString(),
              version: PHOTO_CONSENT_VERSION,
              keepPhotos,
            },
          })),

        withdrawPhotoConsent: () =>
          touch((answers) => ({
            photoConsent: { ...answers.photoConsent, acceptedAt: null, version: null },
          })),

        setKeepPhotos: (keepPhotos) =>
          touch((answers) => ({ photoConsent: { ...answers.photoConsent, keepPhotos } })),

        setNotificationsOptIn: (notificationsOptIn) => touch(() => ({ notificationsOptIn })),

        complete: () =>
          set({ status: 'completed', completedAt: new Date().toISOString(), pendingSync: true }),

        markSynced: () => set({ pendingSync: false }),

        reset: () => set({ ...initialState, hasHydrated: true }),

        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      };
    },
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        answers: state.answers,
        status: state.status,
        furthestStep: state.furthestStep,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        pendingSync: state.pendingSync,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
