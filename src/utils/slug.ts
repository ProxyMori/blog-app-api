export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD") // Pisahkan karakter + accent
    .replace(/[\u0300-\u036f]/g, "") // Hapus accent
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
    .replace(/\s+/g, "-") // Spasi → -
    .replace(/-+/g, "-"); // Gabungkan ---- → -
}
