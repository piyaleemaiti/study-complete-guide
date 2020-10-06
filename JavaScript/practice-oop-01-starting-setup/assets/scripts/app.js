class DOMHelper {
  static clearListiner(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
  }
}

class Tooltip {
  constructor(closeTooltipFun) {
    this.closeTooltipNotifier = closeTooltipFun;
  }
  closeTooltip = () => {
    this.detach();
    this.closeTooltipNotifier();
  }
  detach() {
    this.element.remove();
  }
  attach() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    tooltipElement.textContent = 'DUMMY!';
    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
    document.body.append(tooltipElement);
  }
}

class ProjectItem {
  hasActiveTooltip = false;
  constructor(id, updateProjectListHandlerFun, type) {
    this.id = id;
    this.updateProjectHandler = updateProjectListHandlerFun;
    this.connectMoreInfoButton();
    this.connectSwitchButton(type);
  }
  closeTooltipNotifier = () => {
    this.hasActiveTooltip = false;
  }
  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const toolTip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    });
    toolTip.attach();
    this.hasActiveTooltip = true;
  }
  connectMoreInfoButton() {
    const documentElement = document.getElementById(this.id);
    const moreInfoBtn = documentElement.querySelector('button:first-of-type');
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler);
  }
  connectSwitchButton(type) {
    const documentElement = document.getElementById(this.id);
    let switchBtn = documentElement.querySelector('button:last-of-type');
    switchBtn = DOMHelper.clearListiner(switchBtn);
    switchBtn.textContent = (type === 'active') ? 'Finish' : 'Activate';
    switchBtn.addEventListener('click', this.updateProjectHandler.bind(null, this.id));
  }
  update(updateProjectListsFun, type) {
    this.updateProjectHandler = updateProjectListsFun;
    this.connectSwitchButton(type);
  }
}

class ProjectList {
  projects = [];
  constructor(type) {
    this.type = type;
    const projectItems = document.querySelectorAll(`#${type}-projects li`);
    for (const projItem of projectItems) {
      this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this), this.type));
    }
  }
  setupSwitchHandler(switchHandlerFun) {
    this.switchHandler = switchHandlerFun;
  }
  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }
  switchProject(projectId) {
    this.switchHandler(this.projects.find(p => p.id === projectId));
    this.projects = this.projects.filter(p => p.id !== projectId);
  }
}

class App {
  static init() {
    const activeProject = new ProjectList('active');
    const finishedProject = new ProjectList('finished');
    activeProject.setupSwitchHandler(finishedProject.addProject.bind(finishedProject));
    finishedProject.setupSwitchHandler(activeProject.addProject.bind(activeProject));
  }
}

App.init();
