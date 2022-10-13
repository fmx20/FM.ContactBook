namespace FM.ContactBook.Server.Utils
{
    public class ThreadSafeList<T>
    {
        private readonly List<T> _list = new();
        private readonly object _lock = new();

        public int Count
        {
            get 
            { 
                lock(_lock)
                {
                    return _list.Count;
                } 
            }
        }

        public void Add(T value)
        {
            lock (_lock)
            {
                _list.Add(value);
            }
        }

        public T FirstOrDefault()
        {
            lock (_lock)
            {
                return _list.FirstOrDefault();
            }
        }

        public T FirstOrDefault(Func<T, bool> predicate)
        {
            lock (_lock)
            {
                return _list.FirstOrDefault(predicate);
            }
        }

        public bool Remove(T item)
        {
            lock (_lock)
            {
                return _list.Remove(item);
            }
        }

        public int RemoveAll(Predicate<T> predicate)
        {
            lock (_lock)
            {
                return _list.RemoveAll(predicate);
            }
        }

        public IEnumerable<T> Where(Func<T, bool> predicate)
        {
            lock (_lock)
            {
                return _list.Where(predicate);
            }
        }
    }
}
