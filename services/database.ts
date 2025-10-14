import { supabase } from './supabaseClient';
import { TestResult } from '../types';

export const getOrCreateUser = async (clerkUserId: string) => {
    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
    }

    if (!user) {
        const { data: newUser, error: newUserError } = await supabase
            .from('users')
            .insert([{ clerk_user_id: clerkUserId }])
            .single();

        if (newUserError) {
            throw new Error(newUserError.message);
        }
        user = newUser;
    }

    return user;
};

export const saveTestResult = async (userId: string, result: TestResult) => {
    const { data, error } = await supabase.from('test_results').insert([
        {
            user_id: userId,
            wpm: result.wpm,
            accuracy: result.accuracy,
            raw_wpm: result.rawWpm,
            time_duration: result.timeDuration,
            test_mode: result.testMode,
            word_count: result.wordCount,
            quote_length: result.quoteLength,
        },
    ]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getUserStats = async (userId: string) => {
    const { data, error } = await supabase
        .from('test_results')
        .select('wpm, accuracy, raw_wpm, time_duration')
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message);
    }

    const testsCompleted = data.length;
    const totalWpm = data.reduce((acc, test) => acc + test.wpm, 0);
    const totalAcc = data.reduce((acc, test) => acc + test.accuracy, 0);
    const totalRawWpm = data.reduce((acc, test) => acc + test.raw_wpm, 0);
    const totalTime = data.reduce((acc, test) => acc + test.time_duration, 0);

    const allTimeHigh = Math.max(...data.map(test => test.wpm));
    const averageWpm = testsCompleted > 0 ? totalWpm / testsCompleted : 0;
    const averageAcc = testsCompleted > 0 ? totalAcc / testsCompleted : 0;
    const averageRawWpm = testsCompleted > 0 ? totalRawWpm / testsCompleted : 0;

    return {
        testsCompleted,
        timeTyping: new Date(totalTime * 1000).toISOString().substr(11, 8),
        allTimeHigh,
        averageWpm,
        averageAcc,
        averageRawWpm,
    };
};

export const getRecentTests = async (userId: string, limit = 10) => {
    const { data, error } = await supabase
        .from('test_results')
        .select('wpm, accuracy, raw_wpm, time_duration, test_mode, word_count, quote_length, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};