'use client';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { addFriendValidator } from '@/lib/validations/add-friends';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendFriendRequest } from '@/lib/actions/friend.actions';

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton = () => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email });
      const response = await sendFriendRequest({ email });
      if (response.status === 200) {
        setShowSuccessState(true);
      } else {
        setError('email', {
          message: `Failed to send friend request: ${response.message}`,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', {
          message: error.message,
        });
        return;
      }
      setError('email', {
        message: 'Something went wrong',
      });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <Label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-foreground">
        Add friend by E-Mail
      </Label>
      <div className="mt-2 flex gap-2">
        <Input
          {...register('email')}
          type="text"
          placeholder="you@example.com"
          className="sm-leading-6 w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-muted-foreground placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          className="inline-flex items-center rounded-md border bg-primary  px-4 py-2 text-sm font-medium text-background  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Add
        </Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend request sent</p>
      )}
    </form>
  );
};

export default AddFriendButton;
