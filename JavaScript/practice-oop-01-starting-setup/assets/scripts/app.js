import { ProjectList } from './App/ProjectList.js';
class App {
  static init() {
    const activeProject = new ProjectList('active');
    const finishedProject = new ProjectList('finished');
    activeProject.setupSwitchHandler(finishedProject.addProject.bind(finishedProject));
    finishedProject.setupSwitchHandler(activeProject.addProject.bind(activeProject));
    // const timerId = setTimeout(this.startAnalytics, 3000);
    // document.getElementById('analytics-btn').addEventListener('click', () => {
    //   clearTimeout(timerId);
    // });
  }
  static startAnalytics() {
    const analyticsScript = document.createElement('script');
    analyticsScript.src = 'assets/scripts/Utility/analytics.js';
    analyticsScript.defer = true;
    document.head.append(analyticsScript);
  }
}

App.init();
