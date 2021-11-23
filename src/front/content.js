import { Interface } from './interface.js';

async function start() {
    window.interfaceState = 0;
    window.interfaceInstance = new Interface();
    await interfaceInstance.start();
    let bodyNode = document.querySelector('body');
    if (bodyNode) {
        bodyNode.prepend(interfaceInstance.html);
    }
    const toggleBtn = document.querySelector('.nextnextdev_toggleButton input');
    toggleBtn.checked = true;
    toggleBtn.addEventListener('click', async () => {
        window.interfaceState = window.interfaceState === 1 ? 0 : 1;
        toggleBtn.checked = !window.interfaceState;
        if (window.interfaceState === 1) {
            checkMine();
        }
    });
}

async function checkMine() {
    try {
        let pause = 1000;
        let response = await (
            await fetch(
                'https://idle-api.crabada.com/public/idle/teams?user_address=0x1598cbb08cba5c797264132c26ae74ac01260932',
            )
        ).json();
        let myBattlePoint = response.result.data[0].battle_point;
        response = await (
            await fetch(
                'https://idle-api.crabada.com/public/idle/mines?page=1&status=open&looter_address=0x1598cbb08cba5c797264132c26ae74ac01260932&can_loot=1&limit=8',
            )
        ).json();
        let needMineNumber = false;
        for (let index = 0; index < response.result.data.length; index++) {
            const mine = response.result.data[index];
            if (mine.defense_point < myBattlePoint) {
                needMineNumber = mine.game_id;
                break;
            }
        }
        if (needMineNumber !== false) {
            let mineNodes = document.querySelector('.items-title h5');
            for (let index = 0; index < mineNodes.length; index++) {
                const nodeId = Number(mineNodes[index].childNodes[1].data);
                if (nodeId === needMineNumber) {
                    mineNodes[index].click();
                    let loadMineResult = await loadMine();
                    if (loadMineResult === true) {
                        document.querySelector('.mine-footer button.btn.btn-primary').click();
                        let waitPopupResult = waitPopup();
                        if (waitPopupResult === true) {
                            document.querySelector('.mine-footer button.btn.btn-primary').click();
                            pause = 120000;
                        }
                    }
                    break;
                }
            }
        }
        setTimeout(() => {
            if (window.interfaceState) {
                checkMine();
            }
        }, pause);
    } catch (error) {
        console.error('crabada extension:', error);
        setTimeout(() => {
            if (window.interfaceState === 1) {
                checkMine();
            }
        }, 30000);
    }
}

function loadMine() {
    return new Promise(async (resolve, reject) => {
        let tryCount = 60;
        let timerId = setTimeout(function tick() {
            if (document.querySelector('.mine-footer button.btn.btn-primary') !== null) {
                return resolve(true);
            } else if (tryCount > 0 && window.interfaceState === 1) {
                tryCount--;
                timerId = setTimeout(tick, 200);
            } else {
                return resolve(false);
            }
        }, 200);
    });
}

function waitPopup() {
    return new Promise(async (resolve, reject) => {
        let tryCount = 60;
        let timerId = setTimeout(function tick() {
            if (document.querySelector('.ant-btn.btn.btn-primary') !== null) {
                return resolve(true);
            } else if (tryCount > 0 && window.interfaceState === 1) {
                tryCount--;
                timerId = setTimeout(tick, 200);
            } else {
                return resolve(false);
            }
        }, 200);
    });
}

start();
