if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register("/sw.js")
            .then(registration => {
                console.log("Service Worker: Success")
            })
            .catch(err => {
                console.error("Service Worker: Error", err)
            })
    })
}