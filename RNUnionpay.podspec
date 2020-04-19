
Pod::Spec.new do |s|
  package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
  s.name         = "RNUnionpay"
  s.version      = package['version']
  s.summary      = package["description"]
  s.homepage     = package['homepage']
  s.license      = "MIT"
  s.author       = { "author" => "caipeiming" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/caipeiming/react-native-china-unionpay.git", :tag => "master" }
  s.source_files = "ios/RNUnionpay/**/*.{h,m}"
  s.requires_arc = true
  s.frameworks   = 'CFNetwork','SystemConfiguration'
  s.libraries    = 'z'
  s.vendored_libraries = "ios/RNUnionpay/paymentcontrol/*.a"

  s.dependency "React"

end

  