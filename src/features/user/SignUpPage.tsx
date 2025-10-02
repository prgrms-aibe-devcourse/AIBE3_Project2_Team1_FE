import { signUp } from '@/services/user';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SignUpForm = {
  email: string;
  password: string;
  nickname: string;
  name: string;
  phoneNumber: string;
  birthDate: string;
};

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
    nickname: '',
    name: '',
    phoneNumber: '',
    birthDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(form);
      alert('회원가입 성공!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSignUp} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">회원가입</h1>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key as keyof SignUpForm]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 mb-2 w-full"
        />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        가입하기
      </button>
    </form>
  );
};

export default SignUpPage;
