import Image from "next/image";

export default function Story() {
  return (
    <section className="py-20 bg-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/brand/chef_craft.png"
              alt="Chef crafting ramen in a dark kitchen"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C231D]/40 to-transparent" />
          </div>

          {/* Text */}
          <div className="lg:pl-8">
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-4">Our Story</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-[#F0EBE3] mb-6 leading-tight">
              The Craft<br />of Ramen
            </h2>
            <div className="space-y-4 text-[#A09488] leading-relaxed">
              <p>
                Every bowl at Ramen Don begins with a broth simmered for hours — rich, deep, and layered with umami. Our chefs blend traditional Japanese techniques with bold Birmingham spirit.
              </p>
              <p>
                From the slow-rendered pork bone tonkotsu to the delicate yuzu-kissed shoyu, each recipe is a labour of love, crafted to warm the soul and awaken the senses.
              </p>
              <p>
                We source the finest ingredients: hand-selected pork belly, free-range eggs marinated overnight, and nori from the Japanese coast. This is ramen done right.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-[#3D3229]">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-display text-3xl font-semibold text-[#C8892A]">18+</div>
                  <div className="text-xs text-[#A09488] mt-1">Bowls on Menu</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-[#C8892A]">12h</div>
                  <div className="text-xs text-[#A09488] mt-1">Broth Simmer</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-[#C8892A]">B1</div>
                  <div className="text-xs text-[#A09488] mt-1">Birmingham</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
