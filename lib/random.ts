/**
 * 高质量随机数生成与抗聚集采样引擎 (Cryptographically Secure & Anti-Clustering RNG)
 * 解决 Math.random() 伪随机分布不均、生日悖论导致的频繁重复碰撞与聚集问题。
 */

/**
 * 获取基于 Web Crypto 的高质量均匀浮点数 [0, 1)
 * 服务端/降级环境采用高性能混淆种子算法
 */
export function getCryptoRandom(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    // 32 位无符号整数映射到 [0, 1)
    return buffer[0] / 4294967296;
  }
  // Node / SSR 环境下的 crypto 降级或高精度时间混合
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0] / 4294967296;
  }

  // 兜底高精度种子 PRNG (Mulberry32)
  return mulberry32(Date.now() ^ (Math.random() * 0x100000000))();
}

/**
 * 生成 [min, max] 范围内的均匀随机整数（闭区间）
 */
export function getRandomInt(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  const range = max - min + 1;
  const rand = getCryptoRandom();
  return min + Math.floor(rand * range);
}

/**
 * 生成 [min, max) 范围内的均匀随机浮点数
 */
export function getRandomFloat(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  return min + getCryptoRandom() * (max - min);
}

/**
 * 生成唯一安全 ID
 */
export function generateCryptoId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const randomHex = Array.from({ length: 8 }, () =>
    Math.floor(getCryptoRandom() * 16).toString(16)
  ).join('');
  return `${prefix}_${Date.now()}_${randomHex}`;
}

/**
 * 抗聚集洗牌采样器（Anti-Clustering Shuffled Bag & History Ring Buffer）
 * 解决连续多次对话中抽中相同梗或近期高频聚集的问题
 */
export class AntiClusteringPicker<T> {
  private items: T[];
  private recentHistory: number[] = [];
  private maxHistoryLength: number;

  constructor(items: T[], historyRatio = 0.5) {
    this.items = [...items];
    this.maxHistoryLength = Math.max(1, Math.min(items.length - 1, Math.floor(items.length * historyRatio)));
  }

  public updateItems(newItems: T[]): void {
    this.items = [...newItems];
    this.maxHistoryLength = Math.max(1, Math.min(newItems.length - 1, Math.floor(newItems.length * 0.5)));
    this.recentHistory = this.recentHistory.filter((idx) => idx < newItems.length);
  }

  /**
   * 抽取一个非近期重复的随机元素
   */
  public pick(): T {
    if (this.items.length === 0) {
      throw new Error('Picker pool cannot be empty');
    }
    if (this.items.length === 1) {
      return this.items[0];
    }

    // 候选池排除最近出现过的索引
    const candidateIndices: number[] = [];
    for (let i = 0; i < this.items.length; i++) {
      if (!this.recentHistory.includes(i)) {
        candidateIndices.push(i);
      }
    }

    // 若全部都在历史记录中（边界情况），则只排除最新一个
    const validCandidates =
      candidateIndices.length > 0
        ? candidateIndices
        : this.items
            .map((_, i) => i)
            .filter((i) => i !== this.recentHistory[this.recentHistory.length - 1]);

    const chosenCandidateIndex = getRandomInt(0, validCandidates.length - 1);
    const chosenIndex = validCandidates[chosenCandidateIndex];

    // 更新滑动窗口历史
    this.recentHistory.push(chosenIndex);
    if (this.recentHistory.length > this.maxHistoryLength) {
      this.recentHistory.shift();
    }

    return this.items[chosenIndex];
  }
}

/**
 * Mulberry32 高性能伪随机算法 (用于兜底种子生成)
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
