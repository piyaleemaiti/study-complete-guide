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
    element.scrollIntoView({ behavior: 'smooth'});
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }
  detach() {
    this.element.remove();
  }
  attach() {
    this.hostElement.insertAdjacentElement((this.insertBefore ? 'afterbegin' : 'beforeend'), this.element);
  }
}

class Tooltip extends Component {
  constructor(closeTooltipFun, text, hostElementId) {
    super(hostElementId);
    this.closeTooltipNotifier = closeTooltipFun;
    this.text = text;
    this.create();
  }
  closeTooltip = () => {
    this.detach();
    this.closeTooltipNotifier();
  }
  create() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    tooltipElement.textContent = this.text;
    console.log(this.hostElement.getBoundingClientRect());
    const hostElementPosLeft = this.hostElement.offsetLeft;
    const hostElementPosTop = this.hostElement.offsetTop;
    const hostElementHeight = this.hostElement.clientHeight;
    const parentElementScroll = this.hostElement.parentElement.scrollTop;

    const x = hostElementPosLeft + 20;
    const y = hostElementPosTop + hostElementHeight - parentElementScroll - 10;

    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = `${x}px`;
    tooltipElement.style.top = `${y}px`;
    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
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
    const projectElement = document.getElementById(this.id);
    this.toolTipText = projectElement.dataset.extraInfo;
    const toolTip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    }, this.toolTipText, this.id);
    toolTip.attach();
    this.hasActiveTooltip = true;
  }
  connectMoreInfoButton() {
    const documentElement = document.getElementById(this.id);
    const moreInfoBtn = documentElement.querySelector('button:first-of-type');
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));
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
