export const metadata = {
  title: "الشروط والأحكام | فلاي مون للسفر والسياحة",
  description:
    "الشروط والأحكام الخاصة باستخدام موقع فلاي مون وخدمات الحجز وفق الأنظمة المعمول بها في المملكة العربية السعودية.",
};

export default function TermsAndConditionsPage() {
  const sections = [
    { id: "definitions", label: "التعريفات" },
    { id: "use", label: "استخدام الموقع" },
    { id: "booking", label: "الحجوزات والمدفوعات" },
    { id: "cancellation", label: "سياسة الإلغاء والاسترداد" },
    { id: "privacy", label: "الخصوصية وحماية البيانات" },
    { id: "ip", label: "الملكية الفكرية" },
    { id: "liability", label: "حدود المسؤولية" },
    { id: "law", label: "القانون الواجب التطبيق والاختصاص" },
    { id: "changes", label: "التعديلات" },
    { id: "contact", label: "التواصل" },
  ];

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <h1 className="text-3xl md:text-4xl font-extrabold">
            الشروط والأحكام
          </h1>
          <p className="mt-2 text-blue-100">آخر تحديث: 2025-01-01</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mt-8" dir="rtl">
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                محتويات الصفحة
              </h2>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-700 hover:text-blue-600"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="md:col-span-8 lg:col-span-9">
            <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="prose prose-slate max-w-none prose-headings:font-bold">
                <p>
                  تحكم هذه الشروط والأحكام استخدامك لموقع وخدمات فلاي مون للسفر
                  والسياحة في المملكة العربية السعودية. يُعد دخولك أو استخدامك
                  للموقع موافقة على هذه الشروط.
                </p>

                <h2 id="definitions">التعريفات</h2>
                <p>
                  &quot;الموقع&quot;: منصة فلاي مون الإلكترونية.
                  &quot;المستخدم&quot;: أي شخص يصل إلى الموقع أو يستخدم خدماته.
                  &quot;الخدمات&quot;: تشمل حجز الرحلات والفنادق والباقات
                  السياحية وخدمات الدعم.
                </p>

                <h2 id="use">استخدام الموقع</h2>
                <ul>
                  <li>يلتزم المستخدم بتقديم معلومات صحيحة ومحدثة.</li>
                  <li>
                    يُمنع إساءة استخدام الموقع أو محاولة الوصول غير المصرح به.
                  </li>
                  <li>يجوز لنا تعليق أو إيقاف الحسابات المخالفة للسياسات.</li>
                </ul>

                <h2 id="booking">الحجوزات والمدفوعات</h2>
                <ul>
                  <li>
                    تخضع الحجوزات لشروط وأحكام مزودي الخدمة (شركات الطيران،
                    الفنادق).
                  </li>
                  <li>
                    قد تتضمن الأسعار ضرائب أو رسوم إضافية حسب سياسات المزود.
                  </li>
                  <li>
                    تتم المدفوعات عبر مزودي دفع آمنين، وقد تُطبّق سياسات إلغاء
                    واسترداد مختلفة.
                  </li>
                </ul>

                <h2 id="cancellation">سياسة الإلغاء والاسترداد</h2>
                <p>
                  تختلف سياسات الإلغاء حسب نوع الخدمة والمزوّد. سيتم عرض الشروط
                  ذات الصلة قبل إتمام الحجز. في حال وجود استرداد، تتم معالجته
                  وفق سياسات المزوّد والأنظمة المعمول بها.
                </p>

                <h2 id="privacy">الخصوصية وحماية البيانات</h2>
                <p>
                  تخضع بياناتك لسياسة الخصوصية الخاصة بنا والمتوافقة مع نظام
                  حماية البيانات الشخصية السعودي (PDPL). نوصي بمراجعة سياسة
                  الخصوصية.
                </p>

                <h2 id="ip">الملكية الفكرية</h2>
                <p>
                  جميع العلامات والشعارات والمحتوى النصي والمرئي على الموقع
                  مملوكة لفلاي مون أو مرخصة له. لا يجوز نسخها أو استخدامها دون
                  إذن مكتوب مسبق.
                </p>

                <h2 id="liability">حدود المسؤولية</h2>
                <p>
                  نسعى لتقديم معلومات دقيقة، إلا أننا لا نضمن خلو الموقع من
                  الأخطاء بالكامل. لا نتحمل مسؤولية الأضرار غير المباشرة الناتجة
                  عن استخدام الموقع أو تأخر أو إلغاء الخدمات من قبل المزودين.
                </p>

                <h2 id="law">القانون الواجب التطبيق والاختصاص</h2>
                <p>
                  تخضع هذه الشروط لأنظمة المملكة العربية السعودية، ويكون
                  الاختصاص القضائي للمحاكم المختصة داخل المملكة.
                </p>

                <h2 id="changes">التعديلات</h2>
                <p>
                  قد نقوم بتحديث هذه الشروط من وقت لآخر. يعد استمرارك في استخدام
                  الموقع موافقة على النسخة المحدثة.
                </p>

                <h2 id="contact">التواصل</h2>
                <p>
                  لأي استفسارات أو شكاوى، تواصل معنا عبر البريد الإلكتروني
                  contact@flymoon.sa أو الهاتف +1234567890.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
