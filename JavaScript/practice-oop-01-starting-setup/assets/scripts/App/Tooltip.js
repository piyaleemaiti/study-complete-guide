import { Component } from './Component.js';

export class Tooltip extends Component {
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
    const tooltipTemplate = document.getElementById('tooltip');
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    tooltipBody.querySelector('p').textContent = this.text;
    tooltipElement.append(tooltipBody);

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