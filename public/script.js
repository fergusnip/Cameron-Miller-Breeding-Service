const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const yearEl = document.getElementById("year");
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const submitBtn = document.getElementById("submitBtn");

yearEl.textContent = new Date().getFullYear();

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});


  formNote.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to send message.");
    }

    form.reset();
    formNote.textContent = "Sent! We’ll get back to you ASAP.";
  } catch (err) {
    formNote.textContent = `Couldn’t send: ${err.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Enquiry";
  }
});

