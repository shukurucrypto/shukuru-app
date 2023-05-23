import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sweuhykuobqegymoicrj.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZXVoeWt1b2JxZWd5bW9pY3JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NTcwODQ5NiwiZXhwIjoxOTkxMjg0NDk2fQ.oSAMKlRIk7bdXUJcLwNIxinT2s_TZKElLBaLP9X8qUE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getInnerAd = async () => {
  const { data: inners, error } = await supabase
    .from('inner_ad')
    .select('*')
    .order('id', { ascending: false })

  const inner = inners[0]

  return inner
}

export const getBanners = async () => {
  const { data: banners, error } = await supabase
    .from('banner')
    .select('*')
    .order('id', { ascending: false })
    .eq('active', true)

  return banners
}

export const getBannerImgURL = async (img) => {
  const { data, error } = await supabase.storage
    .from('paynapple-bucket')
    .createSignedUrl(`adverts/${img}`, 3600)

  return data
}
