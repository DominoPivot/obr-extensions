const targetOrigin = "https://owlbear.rodeo";
const readyEvent = recv(message => message.id === "OBR_READY");

async function recv (cond: (message: any) => boolean) {
    return new Promise<MessageEvent>(resolve => {
        window.addEventListener("message", function handleMessage (event: MessageEvent) {
            if (event.origin === targetOrigin && cond(event.data)) {
                window.removeEventListener("message", handleMessage);
                resolve(event);
            }
        });
    });
}

async function send (id: string) {
    window.parent.postMessage({ id, data: {}, ref: (await readyEvent).data.data.ref }, targetOrigin);
}

export async function onAction (callback: () => Promise<void>) {
    send("OBR_ACTION_GET_IS_OPEN");
    send("OBR_ACTION_IS_OPEN_SUBSCRIBE");
    await recv(message => message.data.isOpen);
    await send("OBR_IS_OPEN_ACTION_UNSUBSCRIBE");
    await callback();
    window.dispatchEvent(await readyEvent);
}
