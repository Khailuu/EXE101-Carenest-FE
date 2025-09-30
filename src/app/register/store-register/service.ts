export async function registerStore(formData: FormData) {
  const res = await fetch("/api/store-register", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Đăng ký thất bại");
  }

  return res.json();
}
