export function formatNumber(vale: number | string) {
    return new Intl.NumberFormat().format(typeof vale === 'string' ? parseFloat(vale) : vale);
}