export const useWindow = {
    resizeHandlerStack: [] as ((width: number, height: number) => void)[],

    // 添加 resize 事件处理器
    addResizeHandler(handler: (width: number, height: number) => void) {
        if (typeof handler === 'function') {
            this.resizeHandlerStack.push(handler);
        }
        this.ensureListener();
    },

    // 移除指定的 resize 事件处理器
    removeResizeHandler(handler: (width: number, height: number) => void) {
        const index = this.resizeHandlerStack.indexOf(handler);
        if (index > -1) {
            this.resizeHandlerStack.splice(index, 1);
        }
        // 如果没有 handler 了，可以考虑移除事件监听器（可选优化）
        if (this.resizeHandlerStack.length === 0) {
            this.removeListener();
        }
    },

    // 内部：确保事件监听器已绑定
    ensureListener() {
        if (!this.listenerAttached) {
            window.addEventListener('resize', this.handleResize);
            this.listenerAttached = true;
        }
    },

    // 内部：移除事件监听器
    removeListener() {
        if (this.listenerAttached) {
            window.removeEventListener('resize', this.handleResize);
            this.listenerAttached = false;
        }
    },

    // 内部标志位：是否已绑定事件监听器
    listenerAttached: false,

    // 内部：统一处理 resize 事件
    handleResize: function () {
        const { innerWidth, innerHeight } = window;
        useWindow.resizeHandlerStack.forEach(handler => {
            try {
                handler(innerWidth, innerHeight);
            } catch (error) {
                console.error('Error in resize handler:', error);
            }
        });
    },

    // 可选：手动触发所有 handler（用于初始化或强制刷新）
    trigger() {
        const { innerWidth, innerHeight } = window;
        this.resizeHandlerStack.forEach(handler => {
            try {
                handler(innerWidth, innerHeight);
            } catch (error) {
                console.error('Error in resize handler:', error);
            }
        });
    },

    // 可选：清空所有 handler
    clear() {
        this.resizeHandlerStack = [];
        this.removeListener();
    }
};