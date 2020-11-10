import { Tooltip } from './Tooltip.js';
import { DOMHelper } from '../Utility/DOMHelper.js';

export class ProjectItem {
  // hasActiveTooltip = false;
  constructor(id, updateProjectListHandlerFun, type) {
    this.id = id;
    this.hasActiveTooltip = false;
    this.updateProjectHandler = updateProjectListHandlerFun;
    this.connectMoreInfoButton();
    this.connectSwitchButton(type);
    this.connectDrag();
    this.closeTooltipNotifier = () => {
      this.hasActiveTooltip = false;
    };
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
  connectDrag() {
    const item = document.getElementById(this.id);
    item.addEventListener('dragstart', (event) => {
      console.log(event.dataTransfer);
      event.dataTransfer.setData('text/plain', this.id);
      event.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', event => {
      console.log(event);
    });
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