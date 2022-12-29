export class Resize {
    constructor(options, updateSize) {
        this.options = options;
        this.updateSize = updateSize;
        this.handleResize = this.handleResize.bind(this);
    }
    mount() {
        if (this.options.autoresize) {
            window.addEventListener('resize', this.handleResize);
        }
    }
    unmount() {
        if (this.options.autoresize) {
            window.removeEventListener('resize', this.handleResize);
        }
    }
    handleResize() {
        this.updateSize();
    }
}
