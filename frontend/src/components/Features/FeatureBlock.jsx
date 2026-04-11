const FeatureBlock = ({
  badge,
  title,
  subtitle,
  description,
  image,
  alt,
  reverse = false,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={reverse ? "md:order-2" : "md:order-1"}>
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              {badge}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>

            <p className="text-lg text-gray-500 mt-3">
              {subtitle}
            </p>

            <p className="text-gray-600 mt-6 leading-7">
              {description}
            </p>
          </div>
        </div>

        <div className={reverse ? "md:order-1" : "md:order-2"}>
          <div className="relative">
            <div className="absolute inset-0 bg-amber-100 rounded-3xl blur-2xl opacity-40"></div>
            <img
              src={image}
              alt={alt}
              className="relative w-full rounded-3xl shadow-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBlock;