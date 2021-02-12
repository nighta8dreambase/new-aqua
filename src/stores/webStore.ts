import { makeAutoObservable } from "mobx";
import { ReadUserFilter } from "../services/api/user/useReadUser";
import { Profile, Project } from "../types/profile";

class WebStore {
  device: string = "unknown";
  profile: Profile | null = null;
  selectedProject: Project | null = null;
  latestTimeStamp: Date = new Date();

  lang: string = "en";
  setLang(lang: string) {
    this.lang = lang;
  }
  //Filter
  startDate: Date | null = null;
  setStartDate(ts: Date | null) {
    this.startDate = ts;
  }
  endDate: Date | null = null;
  setEndDate(ts: Date | null) {
    this.endDate = ts;
  }
  filter_hour: number | null = null;
  set_filter_hour(v: any) {
    this.filter_hour = v;
  }
  filter_temp: string | null = null;
  set_filter_temp(v: any) {
    this.filter_temp = v;
  }
  filter_wear: string | null = null;
  set_filter_wear(v: any) {
    this.filter_wear = v;
  }
  filter_battery: string | null = null;
  set_filter_battery(v: any) {
    this.filter_battery = v;
  }
  filter_yacht_name: string | null = null;
  set_filter_yacht_name(v: any) {
    this.filter_yacht_name = v;
  }
  filter_geo_fence: string | null = null;
  set_filter_geo_fence(v: any) {
    this.filter_geo_fence = v;
  }
  resetFilter() {
    this.setStartDate(null); //
    this.setEndDate(null);
    this.set_filter_hour(null);
    this.set_filter_temp(null);
    this.set_filter_wear(null);
    this.set_filter_battery(null);
    this.set_filter_yacht_name(null);
    this.set_filter_geo_fence(null);
  }
  get readUserFilter() {
    return {
      startDate: this.startDate,
      endDate: this.endDate || this.latestTimeStamp,
      filterHour: this.filter_hour,
    } as ReadUserFilter;
  }
  constructor() {
    makeAutoObservable(this);
  }
  setDevice(device: "unknown" | "mobile" | "desktop") {
    this.device = device;
  }
  setLatestTimeStamp(ts: Date) {
    this.latestTimeStamp = ts;
  }

  setProfile(profile: Profile | null) {
    this.profile = profile;
    let selectedProject = null;
    if (this.profile) {
      if (localStorage.getItem("projectId")) {
        selectedProject = this.profile.project.filter(
          ({ id }) => id === localStorage.getItem("projectId")
        )[0];
      }
      if (!selectedProject && this.profile.project.length === 1) {
        selectedProject = this.profile.project[0];
      }
    }

    this.setSelectedProject(selectedProject);
  }
  setSelectedProject(project: Project | null) {
    console.log("setSelectedProject", project);
    if (project) {
      localStorage.setItem("projectKey", project.project_key);
      localStorage.setItem("projectId", project.id);
    } else {
      localStorage.removeItem("projectKey");
    }
    this.selectedProject = project;
  }
}
//
export const webStore = new WebStore();
