const AuthLayout = ({ title, subtitle, image, children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white p-8">
        <img
          src={image}
          alt="auth visual"
          className="w-full max-w-md object-contain"
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#6a4e1c] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-white text-4xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-gray-300 mt-3 text-sm">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;