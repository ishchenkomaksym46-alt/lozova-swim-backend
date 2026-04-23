// Функция для автоматического распределения дорожек
// Лучшие результаты в центре, худшие по краям

export function distributeLanes(participants: Array<{ declared_time: string }>, laneCount: number): number[] {
    // Конвертируем время в секунды для сортировки (формат мм:сс.мс)
    const parseTime = (time: string): number => {
        const parts = time.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0]);
            const secondsAndMs = parts[1].split('.');
            const seconds = parseInt(secondsAndMs[0]);
            const milliseconds = secondsAndMs[1] ? parseInt(secondsAndMs[1]) / 100 : 0;
            return minutes * 60 + seconds + milliseconds;
        }
        return parseFloat(time);
    };

    // Сортируем участников по времени (лучшие первые)
    const sorted = participants
        .map((p, index) => ({ index, time: parseTime(p.declared_time) }))
        .sort((a, b) => a.time - b.time);

    // Создаем массив для назначения дорожек
    const lanes = new Array(participants.length).fill(0);

    // Распределяем дорожки от центра к краям
    const centerLanes = getCenterLanes(laneCount);

    let laneIndex = 0;
    for (let i = 0; i < sorted.length; i++) {
        lanes[sorted[i].index] = centerLanes[laneIndex % centerLanes.length];
        laneIndex++;
    }

    return lanes;
}

// Функция для получения порядка дорожек от центра к краям
function getCenterLanes(laneCount: number): number[] {
    const lanes: number[] = [];
    const center = (laneCount + 1) / 2;

    // Для четного количества дорожек
    if (laneCount % 2 === 0) {
        const mid1 = Math.floor(laneCount / 2);
        const mid2 = mid1 + 1;
        lanes.push(mid1, mid2);

        for (let i = 1; i <= Math.floor(laneCount / 2) - 1; i++) {
            lanes.push(mid1 - i, mid2 + i);
        }
    } else {
        // Для нечетного количества дорожек
        const mid = Math.ceil(laneCount / 2);
        lanes.push(mid);

        for (let i = 1; i <= Math.floor(laneCount / 2); i++) {
            lanes.push(mid - i, mid + i);
        }
    }

    return lanes;
}
